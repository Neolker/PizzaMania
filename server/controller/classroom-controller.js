const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/classroom/create-abl");
const GetAbl = require("../abl/classroom/get-abl");
const LoadAbl = require("../abl/classroom/load-abl");
const UpdateAbl = require("../abl/classroom/update-abl");
const DeleteAbl = require("../abl/classroom/delete-abl");
const ListAbl = require("../abl/classroom/list-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.get("/load", async (req, res) => {
  await LoadAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

module.exports = router;
