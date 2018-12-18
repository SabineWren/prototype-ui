/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import * as Graph from "./graph.js";

export const AddNode = function(event) {
	const selection = document.getElementById("node-selection-effect");
	if(selection) {
		const parent = selection.parentElement;
		const child = Graph.CreateChild("child", 100, 0);
		parent.prepend(child);
	} else {
		const root = Graph.CreateNode("root node", 400, 400);
		document.getElementById("graph").appendChild(root);
		SetNewSelection(root);
	}
};

export const RemoveNode = function(event) {
	const oldSelect = document.getElementById("node-selection-effect");
	if(!oldSelect) { return; }
	
	let toDelete = oldSelect.parentElement;
	if(toDelete.parentElement.id === "graph") {//delete root node
		toDelete.parentElement.removeChild(toDelete);
		return;
	}
	
	const edge = toDelete.parentElement;
	const parent = edge.parentElement;
	parent.removeChild(edge);
	SetNewSelection(parent);
};

export const SetNewSelection = function(node) {
	const oldSelect = document.getElementById("node-selection-effect");
	if(oldSelect) { oldSelect.parentElement.removeChild(oldSelect); }
	
	const glow = Graph.CreateGlow();
	node.prepend(glow);
};

