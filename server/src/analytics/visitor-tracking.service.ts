import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visitor } from './schemas/visitor.schema';
import * as geoip from 'geoip-lite';

@Injectable()
export class VisitorTrackingService {
  private readonly logger = new Logger(VisitorTrackingService.name);

  constructor(
    @InjectModel(Visitor.name) private visitorModel: Model<Visitor>,
  ) {}

  async trackVisitor(data: {
    ip: string;
    userAgent: string;
    page: string;
    referrer?: string;
    sessionId: string;
    userId?: string;
  }) {
    try {
      const deviceInfo = this.parseUserAgent(data.userAgent);
      const geoInfo = this.getGeoLocation(data.ip);

      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const existingVisitor = await this.visitorModel.findOne({
        sessionId: data.sessionId,
        lastActivity: { $gte: thirtyMinutesAgo },
      });

      if (existingVisitor) {
        existingVisitor.lastActivity = new Date();
        existingVisitor.pageViews += 1;
        existingVisitor.page = data.page;
        existingVisitor.isActive = true;
        existingVisitor.country = geoInfo.country;
        existingVisitor.city = geoInfo.city;
        existingVisitor.device = deviceInfo.device;
        existingVisitor.browser = deviceInfo.browser;
        existingVisitor.os = deviceInfo.os;
        if (data.userId) {
          existingVisitor.userId = new Types.ObjectId(data.userId);
        }
        await existingVisitor.save();
        return existingVisitor;
      }

      const visitor = new this.visitorModel({
        ip: data.ip,
        userAgent: data.userAgent,
        page: data.page,
        referrer: data.referrer || 'Direct',
        sessionId: data.sessionId,
        userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        country: geoInfo.country,
        city: geoInfo.city,
        lastActivity: new Date(),
        isActive: true,
      });

      await visitor.save();
      this.logger.log(
        `New visitor tracked: ${data.ip} - ${deviceInfo.device} - ${data.page}`,
      );
      return visitor;
    } catch (error) {
      this.logger.error('Error tracking visitor:', error);
      throw error;
    }
  }

  async getActiveVisitors() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const activeVisitors = await this.visitorModel
      .find({
        lastActivity: { $gte: thirtyMinutesAgo },
        isActive: true,
      })
      .populate('userId', 'name email username')
      .sort({ lastActivity: -1 })
      .limit(100)
      .lean();

    return {
      total: activeVisitors.length,
      visitors: activeVisitors.map((v: any) => ({
        id: v._id,
        ip: v.ip,
        page: v.page,
        device: v.device,
        browser: v.browser,
        os: v.os,
        country: v.country || 'Unknown',
        city: v.city || 'Unknown',
        referrer: v.referrer,
        pageViews: v.pageViews,
        lastActivity: v.lastActivity,
        userId: v.userId?._id || v.userId,
        userName: v.userId?.name || v.userId?.username || null,
        userEmail: v.userId?.email || null,
      })),
    };
  }

  async markInactiveVisitors() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const result = await this.visitorModel.updateMany(
      {
        lastActivity: { $lt: thirtyMinutesAgo },
        isActive: true,
      },
      {
        $set: { isActive: false },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(`Marked ${result.modifiedCount} visitors as inactive`);
    }
  }

  private parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase();

    let device = 'desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      device = 'tablet';
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent,
      )
    ) {
      device = 'mobile';
    }

    let browser = 'Unknown';
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'MacOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad'))
      os = 'iOS';

    return { device, browser, os };
  }

  private getGeoLocation(ip: string): { country: string; city: string } {
    if (
      !ip ||
      ip === '::1' ||
      ip === '127.0.0.1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.20.') ||
      ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') ||
      ip.startsWith('172.23.') ||
      ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') ||
      ip.startsWith('172.26.') ||
      ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') ||
      ip.startsWith('172.29.') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')
    ) {
      return { country: 'Georgia', city: 'Tbilisi' };
    }

    try {
      const geo = geoip.lookup(ip);

      if (geo) {
        const countryName = this.getCountryName(geo.country);
        const cityName = geo.city || this.getDefaultCity(geo.country);

        return {
          country: countryName,
          city: cityName,
        };
      }
    } catch (error) {
      this.logger.warn(`Failed to lookup IP: ${ip}`, error);
    }

    return { country: 'Unknown', city: 'Unknown' };
  }

  private getCountryName(countryCode: string): string {
    const countryMap: { [key: string]: string } = {
      GE: 'Georgia',
      US: 'United States',
      GB: 'United Kingdom',
      DE: 'Germany',
      FR: 'France',
      IT: 'Italy',
      ES: 'Spain',
      RU: 'Russia',
      TR: 'Turkey',
      UA: 'Ukraine',
      PL: 'Poland',
      RO: 'Romania',
      NL: 'Netherlands',
      BE: 'Belgium',
      CZ: 'Czech Republic',
      GR: 'Greece',
      PT: 'Portugal',
      SE: 'Sweden',
      HU: 'Hungary',
      AT: 'Austria',
      CH: 'Switzerland',
      BG: 'Bulgaria',
      DK: 'Denmark',
      FI: 'Finland',
      SK: 'Slovakia',
      NO: 'Norway',
      IE: 'Ireland',
      HR: 'Croatia',
      BA: 'Bosnia',
      RS: 'Serbia',
      LT: 'Lithuania',
      SI: 'Slovenia',
      LV: 'Latvia',
      EE: 'Estonia',
      AM: 'Armenia',
      AZ: 'Azerbaijan',
    };
    return countryMap[countryCode] || countryCode;
  }

  private getDefaultCity(countryCode: string): string {
    const defaultCities: { [key: string]: string } = {
      GE: 'Tbilisi',
      US: 'New York',
      GB: 'London',
      DE: 'Berlin',
      FR: 'Paris',
      IT: 'Rome',
      ES: 'Madrid',
      RU: 'Moscow',
      TR: 'Istanbul',
      UA: 'Kyiv',
      PL: 'Warsaw',
      RO: 'Bucharest',
      NL: 'Amsterdam',
      BE: 'Brussels',
      CZ: 'Prague',
      GR: 'Athens',
      PT: 'Lisbon',
      SE: 'Stockholm',
      HU: 'Budapest',
      AT: 'Vienna',
      CH: 'Zurich',
      BG: 'Sofia',
      DK: 'Copenhagen',
      FI: 'Helsinki',
      SK: 'Bratislava',
      NO: 'Oslo',
      IE: 'Dublin',
      HR: 'Zagreb',
      BA: 'Sarajevo',
      RS: 'Belgrade',
      LT: 'Vilnius',
      SI: 'Ljubljana',
      LV: 'Riga',
      EE: 'Tallinn',
      AM: 'Yerevan',
      AZ: 'Baku',
    };
    return defaultCities[countryCode] || 'Unknown';
  }
}
