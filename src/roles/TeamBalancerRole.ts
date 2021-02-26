import AbstractRole from "./AbstractRole";


class TeamBalancerRole extends AbstractRole{
    constructor() {
        super(
            "W+ TeamBalancer",
            "Users with this permission are able to use the W+ Balancer."
        );
    }
}

export default new TeamBalancerRole()
