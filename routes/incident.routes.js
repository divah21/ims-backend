import {Router} from "express";

import {
    createIncident,
    getIncidents,
    deleteIncident,
    updateIncident,
    getIncidentStats, getDashboardStats, getIncidentById
} from "../controllers/incident.controller.js";

const incidentRouter = Router();

incidentRouter.post("/create", createIncident);
incidentRouter.get("/get-all", getIncidents);
incidentRouter.get("/stats", getIncidentStats);
incidentRouter.get("/dashboard-stats", getDashboardStats);
incidentRouter.get("/get-by-id/:id",getIncidentById )
incidentRouter.put("/update/:id", updateIncident);
incidentRouter.delete("/delete/:id", deleteIncident);

export default incidentRouter;