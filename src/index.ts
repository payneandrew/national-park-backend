import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const app = express();
app.use(bodyParser.json());
const port = 8080;

let parkIds: string[] = ["1321413245135", "4312413"];

app.get("/visited-parks", (req: Request, res: Response) => {
  res.json(parkIds);
});

app.post("/visited-parks", (req: Request, res: Response) => {
  const { id } = req.body;
  parkIds.push(id);
  res.status(201).json(parkIds);
});

app.delete("/visited-parks/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const initialLength = parkIds.length;

  parkIds = parkIds.filter((parkId) => parkId !== id);

  if (initialLength === parkIds.length) {
    res.status(404).json({ message: `Park with id ${id} not found` });
  } else {
    res.json({ message: `Deleted park with id ${id}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
