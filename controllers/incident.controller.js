import Incident from "../models/Incident.js";
import Department from "../models/Department.js";

export const createIncident = async (req, res) => {
    try {
        const { title, reporter_id, department_id, type, priority, description, status } = req.body;
        const incident = await Incident.query().insert({
            title,
            reporter_id,
            department_id,
            type,
            priority,
            description,
            status: status || "Open",
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.query().withGraphFetched("[reporter, department]");
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            department_id,
            type,
            priority,
            description,
            status
        } = req.body;

        const updatedIncident = await Incident.query().patchAndFetchById(id, {
            title,
            department_id,
            type,
            priority,
            description,
            status,
        });

        res.status(200).json(updatedIncident);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params;
        await Incident.query().deleteById(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getIncidentStats = async (req, res) => {
    try {
        const now = new Date();

        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const getStats = async (fromDate) => {
            const data = await Incident.query()
                .select("type", "department_id")
                .count("id as count")
                .where("created_at", ">=", fromDate)
                .groupBy("type", "department_id");

            // Group into type and department counts
            const byType = {};
            const byDepartment = {};

            for (const item of data) {
                byType[item.type] = (byType[item.type] || 0) + Number(item.count);
                byDepartment[item.department_id] =
                    (byDepartment[item.department_id] || 0) + Number(item.count);
            }

            return { byType, byDepartment };
        };

        const [weekly, monthly, yearly] = await Promise.all([
            getStats(oneWeekAgo),
            getStats(oneMonthAgo),
            getStats(oneYearAgo),
        ]);

        const departments = await Department.query().select("id", "name");

        const getDeptName = (id) => {
            const dept = departments.find((d) => d.id === id);
            return dept ? dept.name : `Dept ${id}`;
        };

        const mapDeptNames = (byDepartment) => {
            const mapped = {};
            for (const id in byDepartment) {
                mapped[getDeptName(Number(id))] = byDepartment[id];
            }
            return mapped;
        };

        res.status(200).json({
            weekly: {
                ...weekly,
                byDepartment: mapDeptNames(weekly.byDepartment),
            },
            monthly: {
                ...monthly,
                byDepartment: mapDeptNames(monthly.byDepartment),
            },
            yearly: {
                ...yearly,
                byDepartment: mapDeptNames(yearly.byDepartment),
            },
        });
    } catch (error) {
        console.error("Incident stats error:", error);
        res.status(500).json({ error: error.message });
    }
};

// controllers/incidentController.js
export const getDashboardStats = async (req, res) => {
    try {
        const totalIncidents = await Incident.query().resultSize();

        const nearMisses = await Incident.query()
            .where("type", "=", "Near Miss")
            .resultSize();

        const lostTimeInjuries = await Incident.query()
            .where("type", "=", "Lost Time Injury")
            .resultSize();

        const latestIncident = await Incident.query()
            .orderBy("created_at", "desc")
            .first();

        let daysIncidentFree = 0;
        if (latestIncident) {
            const lastDate = new Date(latestIncident.created_at);
            const today = new Date();
            const diffTime = Math.abs(today - lastDate);
            daysIncidentFree = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        res.status(200).json({
            totalIncidents,
            nearMisses,
            lostTimeInjuries,
            daysIncidentFree,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params;

        const incident = await Incident.query()
            .findById(id)
            .withGraphFetched("[reporter, department]");

        if (!incident) {
            return res.status(404).json({ error: "Incident not found" });
        }

        res.status(200).json(incident);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
