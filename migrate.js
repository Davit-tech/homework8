import {Reviews, Users,Books} from "./models/index.js";


(async () => {
    const models = [Users, Books, Reviews];
    for (const model of models) {
        console.warn("Migrate", model.name);

        await model.sync({alter: true});
        // try {
        //     await models.createDefaults({});
        // } catch (error) {
        //     console.error(error);
        // }
    }

})();