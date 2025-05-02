import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "crypto";
import { Url } from "src/common/database/entities/url.entity";
import { Repository } from "typeorm";
import { ExceptionHandler } from "winston";

@Injectable()
export class UrlShortenerService {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  private async generateBase64Token(length: number): Promise<string> {
    const buffer = randomBytes(Math.ceil((length * 3) / 4)); // Generate enough random bytes
    return buffer
      .toString("base64") // Convert to Base64
      .replace(/\+/g, "-") // URL-safe: replace + with -
      .replace(/\//g, "_") // URL-safe: replace / with _
      .replace(/=+$/, "") // Remove padding
      .slice(0, length); // Ensure fixed length
  }

  private async generateExpirationDate() {
    const today = new Date();
    const days = 10;
    return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private async isValidUrl(value: string): Promise<boolean> {
    const pattern: RegExp = new RegExp(
      "^https?:\\/\\/" + // Protocol (http or https)
        "(?:www\\.)?" + // Optional www.
        "[-a-zA-Z0-9@:%._\\+~#=]{1,256}" + // Domain name characters
        "\\.[a-zA-Z0-9()]{1,6}\\b" + // Top-level domain
        "(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$", // Optional query string
      "i", // Case-insensitive flag
    );

    return pattern.test(value);
  }

  public async getOrigUrl(shortUrl: string): Promise<string> {
    // Check if the entry exists and the url has not expired
    const existingUrl = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!existingUrl) throw new NotFoundException("url not found");
    if (new Date().getTime() > existingUrl.expiresAt.getTime()) throw new BadRequestException("expired url");

    // Update the click count
    existingUrl.clicks += 1;
    await this.urlRepository.update(existingUrl.id, existingUrl);

    return existingUrl.origUrl;
  }

  public async createShortUrl(origUrl: string): Promise<string> {
    // Check if an entry already exists, if true, return
    const existingUrl = await this.urlRepository.findOne({ where: { origUrl } });
    if (existingUrl) return existingUrl.shortUrl;

    // Check if the url is valid
    const isValid = await this.isValidUrl(origUrl);
    if (!isValid) throw new BadRequestException("invalid url");

    // Create a short url and then check to see if it exists
    let shortUrl = await this.generateBase64Token(8);
    let existingShortUrl = await this.urlRepository.findOne({ where: { shortUrl } });

    // If it does, retry
    while (existingShortUrl) {
      shortUrl = await this.generateBase64Token(8);
      existingShortUrl = await this.urlRepository.findOne({ where: { shortUrl } });
    }

    // Define the expiration 10 days from now
    const expiresAt = await this.generateExpirationDate();

    // Create the entry
    const url = this.urlRepository.create();
    url.shortUrl = shortUrl;
    url.origUrl = origUrl;
    url.expiresAt = expiresAt;
    await this.urlRepository.save(url);

    return shortUrl;
  }
}
