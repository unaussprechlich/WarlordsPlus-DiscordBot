import AbstractRole from "./AbstractRole";


class CompetitiveRole extends AbstractRole{
    constructor() {
        super(
            "W+ Competitive",
            "Users with this permission are able to use the W+ Balancer."
        );
    }
}

export default new CompetitiveRole()
