import React, { useState } from 'react'
import axios from 'axios';

function RuleForm() {
    const [ruleString, setruleString] = useState('');
    const [response , setResponse] = useState('');

    const createRule = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/rules/create_rule', { ruleString });
            setResponse(res.data.message);
        } catch (error) {
            setResponse('Error creating rule.');
        }
    };
  return (
    <div>
      <h3> Create Rule</h3>
      <textarea className='box-one'
      value = {ruleString}
      onChange={(e) => setruleString(e.target.value)}
      rows = "5"
      cols="50"
      placeholder='Enter rule string here'
      />
      <br />
      <button className='btn' onClick={createRule}>Create Rule</button>
      <p>{response}</p>
    </div>
  )
}

export default RuleForm
