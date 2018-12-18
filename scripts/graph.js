/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
const SVG_URL = "http://www.w3.org/2000/svg";
//avoid CSS custom properties in SVGs or Firefox breaks
const NODE_COLOUR_GLOW = "orange";
const NODE_COLOUR_OUTLINE = "blue";
const NODE_RADIUS = "30px";
const NODE_RADIUS_BLUR = `${30.0 / 0.85}px`;
const NODE_SIZE_GLOW = "6px";
const NODE_SIZE_BORDER = "3px";

export const CreateGlow = function() {
	const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	glow.setAttributeNS(null, "cx", 0);
	glow.setAttributeNS(null, "cy", 0);
	glow.setAttributeNS(null, "fill",         "none");
	glow.setAttributeNS(null, "filter",       "url(#blur)");
	glow.setAttributeNS(null, "opacity",      "0.4");
	glow.setAttributeNS(null, "stroke",       NODE_COLOUR_GLOW);
	glow.setAttributeNS(null, "stroke-width", NODE_SIZE_GLOW);
	glow.id = "node-selection-effect";

	const animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
	animation.setAttributeNS(null, "attributeName", "r");
	animation.setAttributeNS(null, "calcMode", "discrete");
	animation.setAttributeNS(null, "dur", "1s");
	animation.setAttributeNS(null, "repeatCount", "indefinite");
	//performance hack to reduce framerate instead of interpolating at 60fps
	animation.setAttributeNS(null, "values", "35; 36; 37; 38; 39; 40; 41; 42; 43; 43; 42; 41; 40; 39; 38; 37; 36; 35");
	glow.append(animation);//keyTimes
	return glow;
};

export const CreateNode = function(label, x, y) {
	const node = document.createElementNS(SVG_URL, "g");
	node.classList.add("node");
	node.setAttributeNS(null, "transform", `translate(${x},${y})`);
	
	const background = document.createElementNS(SVG_URL, "circle");
	background.setAttributeNS(null, "cx", 0);
	background.setAttributeNS(null, "cy", 0);
	background.setAttributeNS(null, "r", NODE_RADIUS_BLUR);
	background.setAttributeNS(null, "fill",   "url(#node-background)");
	background.setAttributeNS(null, "filter", "url(#blur)");
	background.setAttributeNS(null, "stroke", "none");
	node.appendChild(background);
	
	const outline = document.createElementNS(SVG_URL, "circle");
	outline.setAttributeNS(null, "cx", 0);
	outline.setAttributeNS(null, "cy", 0);
	outline.setAttributeNS(null, "r", NODE_RADIUS);
	outline.setAttributeNS(null, "fill",         "none");
	outline.setAttributeNS(null, "stroke",       NODE_COLOUR_OUTLINE);
	outline.setAttributeNS(null, "stroke-width", NODE_SIZE_BORDER);
	node.appendChild(outline);
	
	const text = document.createElementNS(SVG_URL, "text");
	text.setAttributeNS(null, "x", 0);
	text.setAttributeNS(null, "y", 45);
	text.textContent = label;
	text.setAttributeNS(null, "stroke", "white");
	text.setAttributeNS(null, "text-anchor", "middle");
	node.append(text);
	
	return node;
};

const createEdge = function(x, y) {
	const edge = document.createElementNS(SVG_URL, "g");
	edge.classList.add("edge");
	
	const line = document.createElementNS(SVG_URL, "line");
	line.setAttributeNS(null, "x1", 0);
	line.setAttributeNS(null, "y1", 0);
	line.setAttributeNS(null, "x2", x);
	line.setAttributeNS(null, "y2", y);
	line.setAttributeNS(null, "stroke", "white");
	edge.append(line);
	
	return edge;
};

export const CreateChild = function(label, x, y) {
	const child = CreateNode(label, x, y);
	const edge = createEdge(x, y);
	edge.append(child);
	return edge;
};

