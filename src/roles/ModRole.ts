import AbstractRole from "./AbstractRole";

class ModRole extends AbstractRole{
    constructor() {
        super(
            "W+ Mod",
            "Users with this permission can use the moderation tools of W+."
        );
    }
}

export default new ModRole()


