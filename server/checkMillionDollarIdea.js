const { isMillionDollarIdea } = require("../browser/utils");

const checkMillionDollarIdea = (req, res, next) => {
    const isWorthIt = isMillionDollarIdea(Number(req.body.weeklyRevenue), Number(req.body.numWeeks));
    if (isWorthIt) {
        next();
    } else {
        res.status(400).send("Idea not worth a million.")
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
