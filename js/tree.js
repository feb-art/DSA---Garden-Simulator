// Hierarchical tree rendering and DFS/BFS traversal animation

// --- TREE TRAVERSAL BRIDGE & VISIBLE FLOW PATH CONNECTOR ---
function runTraversal(order) {
  if (!currentTreeData || isTraversing) return;
  const orderType = (order || "preorder").toLowerCase();
  let sequence = [];

  if (orderType === "preorder") {
    function preorder(node) {
      if (!node) return;
      sequence.push(node);
      (node.children || []).forEach(preorder);
    }
    preorder(currentTreeData);
  } else if (orderType === "inorder") {
    function inorder(node) {
      if (!node) return;
      const children = node.children || [];
      if (children.length > 0) inorder(children[0]);
      sequence.push(node);
      for (let i = 1; i < children.length; i++) {
        inorder(children[i]);
      }
    }
    inorder(currentTreeData);
  } else if (orderType === "postorder") {
    function postorder(node) {
      if (!node) return;
      (node.children || []).forEach(postorder);
      sequence.push(node);
    }
    postorder(currentTreeData);
  } else if (orderType === "bfs") {
    let queue = [currentTreeData];
    while (queue.length > 0) {
      let curr = queue.shift();
      sequence.push(curr);
      (curr.children || []).forEach(child => queue.push(child));
    }
  }

  animateTraversalSequence(orderType, sequence);
}

function animateTraversalSequence(orderType, sequence) {
  isTraversing = true;
  const textEl = document.getElementById("traversal-result-text");
  
  textEl.innerHTML = `<span class="text-amber-400 font-bold">Traversing (${orderType.toUpperCase()})...</span>`;

  // Clear existing node highlights
  document.querySelectorAll(".node-highlight-active").forEach(el => el.classList.remove("node-highlight-active"));

  let idx = 0;

  const interval = setInterval(() => {
    if (idx < sequence.length) {
      const node = sequence[idx];

      if (node.domCard) {
        node.domCard.classList.add("node-highlight-active");
        setTimeout(() => node.domCard.classList.remove("node-highlight-active"), 750);
      }

      idx++;
    } else {
      clearInterval(interval);
      isTraversing = false;

      const formattedSeq = sequence.map(n => `${n.emoji} ${n.label}`).join(" → ");
      const familyTag = orderType === "bfs" ? "BFS (Queue Level Order)" : `DFS (${orderType.charAt(0).toUpperCase() + orderType.slice(1)})`;
      
      textEl.innerHTML = `<b class="text-yellow-300">${familyTag}:</b> <span class="text-emerald-200">${formattedSeq}</span>`;
      printConsole(`${familyTag}: ${formattedSeq}`);
    }
  }, 500);
}

function getNodeCenter(card, wrapper) {
  const wrapperRect = wrapper.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  return {
    x: cardRect.left + cardRect.width / 2 - wrapperRect.left,
    y: cardRect.top + cardRect.height / 2 - wrapperRect.top
  };
}

// --- VISUAL HIERARCHICAL TREE RENDERER ---
function renderTree(treeData) {
  currentTreeData = treeData;
  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  if (!treeData) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const wrapper = document.createElement("div");
  wrapper.id = "tree-wrapper";
  wrapper.className = "relative p-4 w-max m-auto min-h-[220px]";

  const svg = document.createElementNS(svgNS, "svg");
  svg.id = "tree-svg";
  svg.setAttribute("class", "absolute top-0 left-0 w-full h-full pointer-events-none z-0");

  const structGroup = document.createElementNS(svgNS, "g");
  structGroup.id = "tree-structural-lines";

  const traversalGroup = document.createElementNS(svgNS, "g");
  traversalGroup.id = "tree-traversal-lines";

  svg.appendChild(structGroup);
  svg.appendChild(traversalGroup);
  wrapper.appendChild(svg);

  function buildDOMNode(node, depth = 1) {
    const isLeaf = !node.children || node.children.length === 0;
    const nodeEl = document.createElement("div");
    nodeEl.className = `tree-node flex flex-col items-center ${isLeaf ? "mx-1" : "mx-2"} z-10 relative my-1.5`;

    const card = document.createElement("div");
    const levelClass = `tree-level-${Math.min(5, depth)}`;
    const sizeClass = isLeaf ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
    card.className = `tree-node-card ${levelClass} border rounded-lg ${sizeClass} flex items-center gap-1 font-bold whitespace-nowrap`;
    card.innerHTML = `<span>${node.emoji || '🍃'}</span> <span>${node.label || ''}</span>`;
    
    node.domCard = card;
    nodeEl.appendChild(card);

    if (!isLeaf) {
      const childrenCont = document.createElement("div");
      childrenCont.className = "tree-children flex justify-center items-start mt-6 relative";
      node.children.forEach(child => {
        childrenCont.appendChild(buildDOMNode(child, depth + 1));
      });
      nodeEl.appendChild(childrenCont);
    }
    return nodeEl;
  }

  const treeDOM = buildDOMNode(treeData, 1);
  wrapper.appendChild(treeDOM);
  container.appendChild(wrapper);

  setTimeout(() => drawTreeConnectors(wrapper, structGroup), 50);
}

function drawTreeConnectors(wrapper, structGroup) {
  structGroup.innerHTML = "";
  const wrapperRect = wrapper.getBoundingClientRect();
  const cards = wrapper.querySelectorAll(".tree-node-card");

  cards.forEach(card => {
    const parentNodeEl = card.parentElement;
    const childrenCont = parentNodeEl.querySelector(":scope > .tree-children");
    if (childrenCont) {
      const parentRect = card.getBoundingClientRect();
      const parentX = parentRect.left + parentRect.width / 2 - wrapperRect.left;
      const parentY = parentRect.bottom - wrapperRect.top;

      const childCards = childrenCont.querySelectorAll(":scope > .tree-node > .tree-node-card");
      childCards.forEach(childCard => {
        const childRect = childCard.getBoundingClientRect();
        const childX = childRect.left + childRect.width / 2 - wrapperRect.left;
        const childY = childRect.top - wrapperRect.top;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midY = (parentY + childY) / 2;
        const d = `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#10b981");
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-dasharray", "3 2");
        structGroup.appendChild(path);
      });
    }
  });
}
