export default async function (req, res) {

  const response = await fetch("http://127.0.0.1:5000/api/post_question/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //"X-Api-Key": process.env.LCC_TOKEN
    },
    body: JSON.stringify({
      question: req.body.question,
      history: req.body.history
    }),
  });

    const data = await response.json();

    res.status(200).json({ result: data })
}