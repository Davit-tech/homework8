import {Users, Books, Reviews, Favorites, Comments, Category, BookCategory} from "./models/index.js";


(async () => {
    const models = [Users, Books, Reviews, Favorites, Comments, Category, BookCategory];
    for (const model of models) {
        console.warn("Migrate", model.name);

        await model.sync({alter: true});
        try {
            await model.createDefaults();
        } catch (error) {
            console.error(error);
        }
    }

})();
