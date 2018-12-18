/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import * as Graph from "./graph.js";
import * as Tools from "./nodeTools.js";

const state = {
	degrees: 0.0,
	degreesSens: 2.0,
	isNeedToRender: false,
	keycount: 0,
	keys: {
		leanRight: false,
		leanLeft: false,
		down: false,
		left: false,
		right: false,
		up: false,
	},
	keySens: 12,
	mouse: {
		lastX: 0,
		lastY: 0,
		selected: null,//optimization for mousemove -- reapplied at mousedown and ignored after mouseup
	},
	pixelRatio: 1,
	rootG: null,//target for camera transformations
	viewboxX: -1,
	viewboxY: -1,
	x: 0.0,
	y: 0.0,
	zoom: 1.0,
	zoomSens: 1.05,
};

const applyKeyPresses = function() {
	if(state.keycount === 0) { return; }
	
	if(state.keys.down)  { state.y -= state.keySens; }
	if(state.keys.left)  { state.x += state.keySens; }
	if(state.keys.up)    { state.y += state.keySens; }
	if(state.keys.right) { state.x -= state.keySens; }
	
	if(state.keys.leanRight) { state.degrees -= state.degreesSens; }
	if(state.keys.leanLeft)  { state.degrees += state.degreesSens; }
	if(state.keys.in)        { state.zoom *= state.zoomSens; }
	if(state.keys.out)       { state.zoom /= state.zoomSens; }
};

const KEYCODES = Object.freeze({
	A: 65,
	D: 68,
	E: 69,
	F: 70,
	Q: 81,
	R: 82,
	S: 83,
	W: 87
});

export const HandleKeyDown = function(event) {
	switch(event.keyCode) {
		case KEYCODES.A:
			if(!state.keys.left) {
				state.keys.left = true;
				state.keycount++;
			}
			break;
		case KEYCODES.D:
			if(!state.keys.right) {
				state.keys.right = true;
				state.keycount++;
			}
			break;
		case KEYCODES.E:
			if(!state.keys.leanRight) {
				state.keys.leanRight = true;
				state.keycount++;
			}
			break;
		case KEYCODES.F:
			if(!state.keys.out) {
				state.keys.out = true;
				state.keycount++;
			}
			break;
		case KEYCODES.Q:
			if(!state.keys.leanLeft) {
				state.keys.leanLeft = true;
				state.keycount++;
			}
			break;
		case KEYCODES.R:
			if(!state.keys.in) {
				state.keys.in = true;
				state.keycount++;
			}
			break;
		case KEYCODES.S:
			if(!state.keys.down) {
				state.keys.down = true;
				state.keycount++;
			}
			break;
		case KEYCODES.W:
			if(!state.keys.up) {
				state.keys.up = true;
				state.keycount++;
			}
			break;
		default:
			break;
	}
	state.isNeedToRender = true;
};

export const HandleKeyUp = function(event) {
	switch(event.keyCode) {
		case KEYCODES.A:
			state.keys.left = false;
			state.keycount--;
			break;
		case KEYCODES.D:
			state.keys.right = false;
			state.keycount--;
			break;
		case KEYCODES.E:
			state.keys.leanRight = false;
			state.keycount--;
			break;
		case KEYCODES.F:
			state.keys.out = false;
			state.keycount--;
			break;
		case KEYCODES.Q:
			state.keys.leanLeft = false;
			state.keycount--;
			break;
		case KEYCODES.R:
			state.keys.in = false;
			state.keycount--;
			break;
		case KEYCODES.S:
			state.keys.down = false;
			state.keycount--;
			break;
		case KEYCODES.W:
			state.keys.up = false;
			state.keycount--;
			break;
		default:
			break;
	}
};

const updateDimensions = function() {
	//in case user changed screens
	state.pixelRatio = window.devicePixelRatio;
	
	//in case user resized window
	const rect = document.getElementById("graph").parentElement.getBoundingClientRect();
	state.scale = Math.max(
		1.0 * state.pixelRatio * state.viewboxX / rect.width,
		1.0 * state.pixelRatio * state.viewboxY / rect.height);
};

export const HandleMouseDown = function(event) {
	event.preventDefault();
	state.mouse.lastX = event.clientX;
	state.mouse.lastY = event.clientY;
	if(event.target.tagName === "svg") { return; }
	
	//if we don't have a node, navigate up to one
	let node = event.target;
	while(node.tagName !== "g") { node = node.parentElement; }
	if(node.firstChild.tagName === "line") { return; }
	
	state.mouse.selected = node;
	Tools.SetNewSelection(node);
	updateDimensions();
};

export const HandleMouseMove = function(event) {
	if (!state.mouse.selected) { return; }
	const svg = document.getElementById("graph");
	
	const deltaX = event.clientX - state.mouse.lastX;
	const deltaY = event.clientY - state.mouse.lastY;
	state.mouse.lastX = event.clientX;
	state.mouse.lastY = event.clientY;
	
	const rads = state.degrees * Math.PI / 180.0;
	const magnitudeX = 1.0 * deltaX / state.zoom * state.scale;
	const magnitudeY = 1.0 * deltaY / state.zoom * state.scale;
	
	const transform = state.mouse.selected.transform.baseVal[0];
	const oldX = transform.matrix.e;
	const oldY = transform.matrix.f;
	
	const newX = oldX + Math.cos(rads) * magnitudeX + Math.sin(rads) * magnitudeY;
	const newY = oldY + Math.cos(rads) * magnitudeY - Math.sin(rads) * magnitudeX;
	
	const parent = state.mouse.selected.parentElement;
	if(parent.classList.contains("edge")) {
		const parentX = parent.getAttributeNS(null, "x2");
		const parentY = parent.getAttributeNS(null, "y2");
		
		//TODO push node away from parent
		/*const distanceX = parentX - newX;
		const distanceY = parentY - newY;
		const distance = Math.sqrt(distanceX * distanceX + distanceY + distanceY);
		if(distance < 20) { return; }//prevent child getting trapped under parent
		*/
		const edge = parent.firstChild;
		edge.setAttributeNS(null, "x2", newX);
		edge.setAttributeNS(null, "y2", newY);
	}
	
	transform.setTranslate(newX, newY);
	state.isNeedToRender = true;
};

export const HandleMouseUp = function(event) {
	state.mouse.selected = null;
};

const renderLoop = function() {
	if(state.isNeedToRender) {
		applyKeyPresses();
		const rotation = state.degrees;
		const scaling = state.zoom;
		const translateX = state.x;
		const translateY = state.y;
		const transformString = `translate(${translateX + 400},${translateY + 400}) rotate(${rotation}) scale(${scaling}) translate(-400,-400)`;
		state.rootG.setAttributeNS(null, "transform", transformString);
		
		if(state.keycount === 0) { state.isNeedToRender = false; }
	}
	window.requestAnimationFrame(renderLoop);
};

export const StartRenderLoop = function(rootG) {
	state.rootG = rootG;
	const transform = rootG.transform.baseVal[0];
	state.x = transform.matrix.e;
	state.y = transform.matrix.f;
	state.viewboxX = rootG.parentElement.viewBox.baseVal.width;
	state.viewboxY = rootG.parentElement.viewBox.baseVal.height;
	renderLoop();
};

