import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import StrategyConfigs from './strategy.configs';

@Injectable()
export default class FacebookOauthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly strategyConfigs: StrategyConfigs) {
    super({});
  }
}
