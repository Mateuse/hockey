import { Module, HttpModule, Global } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { RulesModule } from '../rules/rules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from '../schemas/team.schema';

@Module({
    imports: [HttpModule, RulesModule,
              MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema}])],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule {
}
