import _ from "lodash";

export default (schemas, target) => {
    return (req, res, next) => {
        const {error} = schemas.validate(req[target], {
            abortEarly: false,
        });

        if (_.isEmpty(error)) {
            next();
            return;
        }
        console.log(JSON.stringify(error, null, 2));
        const fields = {};
        error.details.forEach((detail) => {
            fields[detail.path[0]] = detail.message;
        });
        if (!_.isEmpty(fields)) {
            res.status(422).json({message: "validation error", fields});
            return;
        }

        next();
    };
};
