import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();
const app = express();
app.use(bodyParser.json());
const port = 8080;

let parkCodes: string[] = ["anch", "cagr"];

app.get("/visited-parks", async (req: Request, res: Response) => {
  try {
    if (parkCodes.length === 0) {
      throw new Error("No parks id found. The list is empty.");
    }

    const { data } = await axios.get("https://developer.nps.gov/api/v1/parks", {
      headers: {
        Accept: "application/json",
      },
      params: {
        api_key: process.env.NP_API_KEY,
        parkCode: parkCodes ? parkCodes.join(",") : "",
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while trying to fetch external API",
    });
  }
});

app.post("/visited-parks/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  if (parkCodes.includes(id)) {
    res.status(409).json({
      message: `Park with id ${id} already exists`,
      list: parkCodes,
    });
    return;
  }
  parkCodes.push(id);
  res.status(201).json({
    message: `Added park with id ${id}`,
    list: parkCodes,
  });
});

app.delete("/visited-parks/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const initialLength = parkCodes.length;

  parkCodes = parkCodes.filter((parkCode) => parkCode !== id);

  if (initialLength === parkCodes.length) {
    res.status(404).json({ message: `Park with id ${id} not found` });
  } else {
    res.json({
      message: `Deleted park with id ${id}`,
      list: parkCodes,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
