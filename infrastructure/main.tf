# CONFIG
provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket  = "terraform-state-golgari"
    key     = "terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags       = { Name = "golgari-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags                    = { Name = "golgari-public-subnet" }
}

resource "aws_subnet" "private1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags              = { Name = "golgari-private1-subnet" }
}

resource "aws_subnet" "private2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1b"
  tags              = { Name = "golgari-private2-subnet" }
}


resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "golgari-internet-gateway" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = { Name = "golgari-route-table" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ECR
# resource "aws_iam_role" "role" {
#   name               = "ecr-role"
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Service": ["ec2.amazonaws.com"]
#       },
#       "Action": "sts:AssumeRole"
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_policy" "policy" {
#   name = "ecr-access-policy"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "ecr:*",
#         ]
#         Effect   = "Allow"
#         Resource = "*"
#       },
#     ]
#   })
# }

# resource "aws_iam_policy_attachment" "attach" {
#   name       = "ecr-attach"
#   roles      = ["${aws_iam_role.role.name}"]
#   policy_arn = aws_iam_policy.policy.arn
# }

resource "aws_ecr_repository" "golgari" {
  name                 = "golgari"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# RDS
resource "aws_security_group" "rds" {
  name        = "golgari-rds-sg"
  description = "Allow PostgreSQL access"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Restrict to VPC CIDR
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "golgari" {
  name       = "golgari-db-subnet-group"
  subnet_ids = [aws_subnet.private1.id, aws_subnet.private2.id] # Use private subnet(s)
}

resource "aws_db_instance" "postgres" {
  identifier             = "golgari-postgres"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "16.8"
  username               = "postgres_admin"
  password               = var.db_password
  db_name                = "golgaridb"
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.golgari.name
  parameter_group_name   = "default.postgres16"
  availability_zone      = "us-east-1a"
}

# ECS Cluster
resource "aws_ecs_cluster" "golgari" {
  name = "golgari-fargate-cluster"
}

# ECS Task Execution Role (required for Fargate tasks)
resource "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "golgari" {
  family                   = "golgari-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "golgari-app"
      image     = aws_ecr_repository.golgari.repository_url
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "main" {
  name            = "golgari-service"
  cluster         = aws_ecs_cluster.golgari.id
  task_definition = aws_ecs_task_definition.golgari.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.public.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs.id]
  }
}

resource "aws_security_group" "ecs" {
  vpc_id = aws_vpc.main.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "aws_ecr_repository" {
  value = aws_ecr_repository.golgari.registry_id
}

output "aws_ecs_cluster" {
  value = aws_ecs_cluster.golgari.name
}

output "aws_ecs_service" {
  value = aws_ecs_service.main.name
}

output "aws_ecs_task_definition" {
  value = aws_ecs_task_definition.golgari.id
}

