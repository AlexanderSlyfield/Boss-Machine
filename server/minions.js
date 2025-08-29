const express = require("express");
const minionsRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require("./db");

minionsRouter.param("minionId", (req, res, next, minionId) => {
    req.minionId = minionId;
    next();
})


minionsRouter.get("/", (req, res, next) => {
    const getAll = getAllFromDatabase("minions").map(({ id, ...rest }) => ({ id, ...rest }));
    res.status(200).json(getAll);
});

minionsRouter.post("/", (req, res, next) => {
    const query = req.body;

    const newMinion = addToDatabase("minions", {
        name: query.name,
        title: query.title,
        salary: Number(query.salary)
    });
    const { id, ...rest } = newMinion;
    res.status(201).send({ id, ...rest });
});

minionsRouter.get("/:minionId", (req, res, next) => {

    const minion = getFromDatabaseById("minions", req.minionId);

    if (minion === undefined) {
        res.status(404).send("Minion not found");
    } else {
        res.status(200).json(minion);
    }

});

minionsRouter.put("/:minionId", (req, res, next) => {
    const query = req.body;
    const minion = getFromDatabaseById("minions", req.minionId);

    if (minion) {
        res.status(200).send(updateInstanceInDatabase("minions", {
            id: req.minionId,
            name: query.name,
            title: query.title,
            weaknesses: minion.weaknesses,
            salary: Number(query.salary)
        }));
    } else {
        res.status(404).send("Minion not found.")
    }
});

minionsRouter.delete("/:minionId", (req, res, next) => {

    if (deleteFromDatabasebyId("minions", req.minionId)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});


module.exports = minionsRouter;