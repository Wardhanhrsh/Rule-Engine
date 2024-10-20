const express = require("express");
const router = express.Router();
const Rule = require("../models/Rule");

function createASTFromruleString(ruleString) {
    const tokens = ruleString.match(/([a-zA-Z]+|[><=!]+|[0-9]+|\(|\)|AND|OR)/g);
    
    function buildAST(tokens) {
        let current = { type: 'operator', operator: null, left: null, right: null };

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === 'AND' || token === 'OR') {
                current.operator = token;
            } else if (token === '') {

                const subExpression = [];
                let depth = 1;
                while (depth > 0) {
                    i++;
                    if (tokens[i] === '(') depth++;
                    if (tokens[i] === ')') depth--;
                    if (depth > 0) subExpression.push(tokens[i]);
                }
                const subAST = buildAST(subExpression);
                if (!current.left) current.left = subAST;
                else current.right = subAST;
            } else if (!current.left) {

                current.left = { type: 'operand', attribute: tokens[i], operator: tokens[i + 1], value: parseInt(tokens[i + 2]) };
                i += 2;
            } else if (!current.right) {

                current.right = { type: 'operand', attribute: tokens[i], operator: tokens[i + 1], value: parseInt(tokens[i + 2]) };
                i += 2;
            }
        }

        return current;
    }

    return buildAST(tokens);
}

router.post('/create_rule', async (req, res) => {
    try {
        const { ruleString } = req.body;
        const ruleAST = createASTFromruleString(ruleString);
        const rule = new Rule({
            rule_id: `rule-${Date.now()}`,
            rule: ruleAST
        });

        await rule.save();
        res.status(200).json({message: "Rule created successfully!"});
    }
        catch (err) {
            res.status(500).json({ error: err.message});
        }
});

router.post('/evaluate_rule', async (req, res) => {

    const {ast, data } = req.body;

    function evaluateAST(node, data) {
        if(node.type === 'operand'){
            switch(node.operator) {
                case '>': return data[node.attribute] > node.value;
                case '<': return data[node.attribute] < node.value;
                case '=': return data[node.attribute] === node.value;
                default: return false;
            }
        } else if (node.type === 'operator'){
            if(node.operator === 'AND') {
                return evaluateAST(node.left, data) && evaluateAST(node.right, data)
            } else if (node.operator === "OR"){
                return evaluateAST(node.left, data) || evaluateAST(node.right, data)
            }
                
        }
    }

    const isEligible = evaluateAST(ast, data);
    res.status(200).json({ eligible: isEligible});
});


function combinedASTs(rules, operator = "AND"){
    if(rules.length === 0) return null;
    if(rules.length === 1) return rules[0];

    let combinedAST = {
        type: "operator",
        operator: operator,
        left: rules[0],
        right: rules[1]
    };

    for(let i = 2; i < rules.length; i++) {
        combinedAST = {
            type: "operator",
            operator: operator,
            left: combinedAST,
            right: rules[i]
    };
    }
    return combinedAST;
}

// combine rules route

router.post('/combine_rules', async (req, res) => {
    try{
        const { ruleStrings, operator } = req.body;

        const ruleASTs = ruleStrings.map(createASTFromruleString);

        const combinedAST = combinedASTs(ruleASTs, operator);

        const combinedRule = new Rule({
            rule_id: `combined-rule-${Date.now()}`,
            rule: combinedAST
        });

        await combinedRule.save();

        res.status(200).json({ message: "Rules combined successfully!", combinedAST});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
})
module.exports = router
