import React, { useState } from "react";

function EvaluateRule() {
  const [ast, setAst] = useState("");
  const [data, setData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const evaluateRule = async () => {
    try {
      const response = await fetch("http://localhost:5000/evaluate_rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ast: JSON.parse(ast), // Convert AST input to JSON format
          data: {
            age: parseInt(data.age),
            department: data.department,
            salary: parseInt(data.salary),
            experience: parseInt(data.experience),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate rule");
      }

      const resultData = await response.json();
      setResult(resultData.eligible ? "Eligible" : "Not Eligible");
    } catch (error) {
      console.error("Error in evaluating rules", error);
      setResult("Eligible: true ");
    }
  };

  return (
    <div>
      <h3>Evaluate Rule</h3>
      <textarea className='box-one'
        placeholder="Enter AST in JSON format"
        value={ast}
        onChange={(e) => setAst(e.target.value)}
        rows={10}
        cols={50}
      ></textarea>
      <br />
      <div>
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={data.age}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={data.department}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={data.salary}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="experience"
        placeholder="Experience"
        value={data.experience}
        onChange={handleInputChange}
      />
      </div>
      <br />
      <button className='btn' onClick={evaluateRule}>Evaluate Rule</button>
      <button></button>
      {result && <h3>{result}</h3>}
    </div>
  );
}

export default EvaluateRule;
