import { Module, HttpModule, Global } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [HttpModule],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule {
}
