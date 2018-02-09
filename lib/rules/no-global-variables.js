'use strict'

/**
 * @fileoverview Disallow variables within the global (script) scope
 * @author Vadim Ruban
 */

module.exports = function (context) {
	var hasTestSuite = false
	var globalVariableDeclarationNodes = []

	return {
		'Program > VariableDeclaration': function (node) {
			globalVariableDeclarationNodes.push(node);
		},
		'CallExpression[callee.name="describe"]': function (node) { hasTestSuite = true },
		'CallExpression[callee.name="xdescribe"]': function (node) { hasTestSuite = true },
		'CallExpression[callee.name="fdescribe"]': function (node) { hasTestSuite = true },
		'Program:exit': function () {
			if (hasTestSuite) {
				for (var i = 0, nodeDetail, len = globalVariableDeclarationNodes.length; i < len; i++) {
					nodeDetail = globalVariableDeclarationNodes[i]

                    context.report({
						message: 'Test has variable declaration in the global scope',
						node: globalVariableDeclarationNodes[i]
					})
				}
            }
            globalVariableDeclarationNodes = []
		}
	}
}
