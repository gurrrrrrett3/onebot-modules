import { bot } from "../../core";
import Module from "../../core/base/module";
import LoadBans from "./modules/loadBans";

export default class ModerationModule extends Module {
name = "moderation";
description = "A module to handle all your moderation needs";

    getModerationModule(): ModerationModule {
        return bot.moduleLoader.getModule("moderation") as ModerationModule;
    }

    override onLoad(): Promise<Boolean> {
        return new Promise(async (resolve) => {
            
            await LoadBans()
            
            resolve(true)
        })
    }
}