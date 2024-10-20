import React from "react";
import "./App.css";
import RuleForm from "./Components/RuleForm";
import EvaluateRuleForm from "./Components/EvaluateRuleForm";

const App = () => {
  return (
    <div className="main">
      <div className="Box">
        <h1>Rule Engine Application</h1>
        <RuleForm />
        <EvaluateRuleForm />
      </div>
    </div>
  );
};

export default App;
