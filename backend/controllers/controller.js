

export async function getData(req, res) { res.status(200).json(data); }
export async function addData(req, res) {
    console.log(req.body);
    const newRecord = req.body;
    data.push(newRecord);
    res.status(201).json(data);
}
export async function updateData(req, res) {
    const newRecord = req.body;
    const id = Number(req.params.id);
    const updatedData = data.map((obj) =>
        obj.id === id ? newRecord : obj
    );
    res.status(200).json(updatedData);
}
export async function deleteData(req, res) {
    const id = Number(req.params.id);
    const updatedData = data.filter((obj) => obj.id !== id);
    res.status(200).json(updatedData);
}