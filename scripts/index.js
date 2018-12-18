/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import * as Graph from "./graph.js";
import * as Input from "./input.js";
import * as Tools from "./nodeTools.js";

const GRAPH = Object.freeze(document.getElementById("graph"));

document.onkeydown   = Input.HandleKeyDown;
document.onkeyup     = Input.HandleKeyUp;
GRAPH.parentElement.onmousedown = Input.HandleMouseDown;
GRAPH.parentElement.onmousemove = Input.HandleMouseMove;
GRAPH.parentElement.onmouseup   = Input.HandleMouseUp;
document.getElementById("insert-node").onclick = Tools.AddNode;
document.getElementById("remove-node").onclick = Tools.RemoveNode;

Input.StartRenderLoop(GRAPH);

