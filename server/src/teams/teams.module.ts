import { Module, HttpModule, Global } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { RulesModule } from '../rules/rules.module';

@Module({
    imports: [HttpModule, RulesModule],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule {
}
