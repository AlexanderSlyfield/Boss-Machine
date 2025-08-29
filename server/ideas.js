const express = require("express");
const ideasRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require("./db");
const checkMillionDollarIdea = require("./checkMillionDollarIdea");

ideasRouter.param("ideaId", (req, res, next, ideaId) => {
    req.ideaId = ideaId;
    next();
});

ideasRouter.get("/", (req, res, next) => {
    const allIdeas = getAllFromDatabase("ideas").map(({ id, ...rest }) => ({ id, ...rest }))
    res.status(200).json(allIdeas);
});

ideasRouter.post("/", checkMillionDollarIdea, (req, res, next) => {

    const body = req.body;
    if (body.name !== undefined && body.description !== undefined && !Number.isNaN(Number(body.numWeeks)) && !Number.isNaN(Number(body.weeklyRevenue))) {
        const newIdea = addToDatabase("ideas", {
            name: req.body.name,
            description: req.body.description,
            numWeeks: Number(req.body.numWeeks),
            weeklyRevenue: Number(req.body.weeklyRevenue)
        });
        const { id, ...rest } = newIdea;
        res.status(201).send({ id, ...rest });
    } else {
        res.status(400).send("Invalid input.");
    }
});

ideasRouter.get("/:ideaId", (req, res, next) => {

    const idea = getFromDatabaseById("ideas", req.ideaId);

    if (idea === undefined) {
        res.status(404).send("Idea not found");
    } else {
        res.status(200).send(idea);
    };
});

const checkIdeaExists = (req, res, next) => {
    const idea = getFromDatabaseById("ideas", req.ideaId);
    if (idea) {
        next();
    } else {
        res.status(404).send("Idea not found");
    }
}

ideasRouter.put("/:ideaId", checkIdeaExists, checkMillionDollarIdea, (req, res, next) => {
    const body = req.body;

    if (body.name && body.description && !Number.isNaN(Number(body.numWeeks)) && !Number.isNaN(Number(body.weeklyRevenue))) {
        const updatedIdea = updateInstanceInDatabase("ideas", {
            id: req.ideaId,
            name: body.name,
            description: body.description,
            numWeeks: Number(body.numWeeks),
            weeklyRevenue: Number(body.weeklyRevenue)
        });
        if (updatedIdea === null) {
            res.status(404).send("Idea not found")
        } else {
            res.status(200).send(updatedIdea);
        }
    } else {
        res.status(400).send("Invalid input");
    };
});

ideasRouter.delete("/:ideaId", (req, res, next) => {
    const deleteSuccess = deleteFromDatabasebyId("ideas", req.ideaId);

    if (deleteSuccess) {
        res.status(204).send("Delete successful");
    } else {
        res.status(404).send();
    };
});



module.exports = ideasRouter;