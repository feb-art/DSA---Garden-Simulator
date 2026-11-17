// DSA topic templates (starter Python code loaded into the Code Editor)

// DSA TOPIC CODE TEMPLATES
const topicTemplates = {
  1: {
    title: "Topic 1: Python OOP + Big O + Stacks (LIFO)",
    code: `# Topic 1: Stacks & Action History Logging
class ActionStack:
    def __init__(self):
        self.stack = []
    def push(self, action):
        self.stack.append(action)
        pushAction(action)
    def pop(self):
        return self.stack.pop() if self.stack else None

s = ActionStack()
s.push("Inspected crop moisture")
s.push("Applied eco-mulch layer")
updateResources(water=120, seeds=15, energy=80, hope=60, coins=110)
unlockAchievement("coins_100", "Harvest Tycoon", "💰")
print("Action Stack updated via Python OOP.")
`
  },
  2: {
    title: "Topic 2: Queues & Deques (FIFO Climate Queue & Calamity Alert)",
    code: `# Topic 2: FIFO Climate & Calamity Warning Trigger
events = [
    "🦗 Locust Swarm Risk (Needs Anti-Pest)",
    "🌧️ Sudden Downpour (+30L Water)",
    "☀️ High Solar Radiation"
]

updateClimateQueue(events)
triggerCalamityWarning("🦗 Locust Swarm Risk!")
print(f"Queued {len(events)} events in FIFO structure and triggered Calamity Alert.")
`
  },
  3: {
    title: "Topic 3: 2D Grid Matrix & Stage Progression",
    code: `# Topic 3: 2D Garden Matrix & Seed Bag Stock
addPlantsToDropdown([
    ["Eggplant", "🍆", 15, 4],
    ["Tomato", "🍅", 10, 5],
    ["Carrot", "🥕", 5, 3]
])

addPlantToGrid(0, "Eggplant", 1, False)   # Seed
addPlantToGrid(1, "Tomato", 2, False)     # Sprout
addPlantToGrid(2, "Carrot", 3, False)     # Young
addPlantToGrid(3, "Corn", 4, False)       # Mature
addPlantToGrid(4, "Watermelon", 4, True)  # Mature + Ready for Harvest (⭐)

pushAction("Updated 2D soil matrix growth stages & Seed Bag inventory")
print("Planted 5 distinct growth stage nodes on grid.")
`
  },
  4: {
    title: "Topic 4 & 7: Hierarchical Trees & Traversal Path Lines",
    code: `# Topic 4 & 7: Hierarchical Tree Traversals (DFS vs BFS)
from pyodide.ffi import to_js
from js import Object

CROPS = [
    ("Eggplant", "🍆"),
    ("Tomato", "🍅"),
    ("Carrot", "🥕"),
    ("Corn", "🌽"),
    ("Watermelon", "🍉"),
]

STAGES = [("Seed", "🌰"), ("Sprout", "🌱"), ("Young", "🌿"), ("Mature", None), ("Ready", "⭐")]
NEEDS = [("Water", "💧"), ("Fertilizer", "🌾"), ("Anti-Pest", "🛡️")]

def make_node(node_id, emoji, label, children=None):
    return {"id": node_id, "emoji": emoji, "label": label, "children": children or []}

def build_crop_branch(name, emoji):
    key = name.lower()
    stages = make_node(f"node-{key}-stages", "📁", "Stages", [
        make_node(f"node-{key}-{label.lower()}", e or emoji, label)
        for label, e in STAGES
    ])
    needs = make_node(f"node-{key}-needs", "📁", "Needs", [
        make_node(f"node-{key}-{label.lower()}", e, label)
        for label, e in NEEDS
    ])
    return make_node(f"node-{key}", emoji, name, [stages, needs])

tree_data = make_node("node-root", "🌱", "Garden Root", [
    build_crop_branch(name, emoji) for name, emoji in CROPS
])

renderTree(to_js(tree_data, dict_converter=Object.fromEntries))
runTraversal("preorder")
print("Built a consistent tree from one template: 5 crops x (Stages + Needs).")
`
  },
  5: { 
    title: "Topic 5: Binary Search Trees (BST)", 
    code: `# Topic 5: Binary Search Tree (BST) Operations
from pyodide.ffi import to_js
from js import Object, renderTree

class BSTNode:
    def __init__(self, price, name, emoji):
        self.price = price
        self.name = name
        self.emoji = emoji
        self.left = None
        self.right = None

    def to_dict(self):
        children = []
        if self.left:
            children.append(self.left.to_dict())
        if self.right:
            children.append(self.right.to_dict())
        return {
            "id": f"bst-{self.price}",
            "emoji": self.emoji,
            "label": f"{self.name} ({self.price}c)",
            "children": children
        }

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, price, name, emoji):
        new_node = BSTNode(price, name, emoji)
        if not self.root:
            self.root = new_node
            return
        curr = self.root
        while True:
            if price < curr.price:
                if curr.left is None:
                    curr.left = new_node
                    break
                curr = curr.left
            else:
                if curr.right is None:
                    curr.right = new_node
                    break
                curr = curr.right

    def search(self, price):
        curr = self.root
        while curr:
            if curr.price == price:
                return curr
            elif price < curr.price:
                curr = curr.left
            else:
                curr = curr.right
        return None

bst = BinarySearchTree()
# Insert crops ordered by Market Cost to build a Binary Search Tree
crops = [
    (20, "Eggplant", "🍆"),
    (10, "Carrot", "🥕"),
    (15, "Tomato", "🍅"),
    (25, "Corn", "🌽"),
    (30, "Watermelon", "🍉")
]

for price, name, emoji in crops:
    bst.insert(price, name, emoji)

# Visually render BST on Tree Panel UI
renderTree(to_js(bst.root.to_dict(), dict_converter=Object.fromEntries))

print("Binary Search Tree (BST) successfully built and rendered!")
found = bst.search(15)
if found:
    print(f"BST Search: Found {found.emoji} {found.name} costing {found.price} coins.")
`
  },
  6: {
    title: "Topic 6: Hash Tables, Collisions, & Rehashing",
    code: `# Topic 6: Hash Tables, Separate Chaining & Rehashing
# Key = plot coordinate (row, col)  ->  Value = Plant state (health, water, sun need)
def next_prime(n):
    while True:
        n += 1
        if n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1)):
            return n

class Plant:
    def __init__(self, crop, health=100, water=50, sun_need=60):
        self.crop, self.health, self.water, self.sun_need = crop, health, water, sun_need

class PlotHashTable:
    MAX_LOAD = 0.75                                   # rehash when N / M goes above this

    def __init__(self, size=11):
        self.size = size
        self.buckets = [[] for _ in range(size)]      # each bucket = a chain of [key, plant]
        self.count = 0
        self.rehash_count = 0

    def _hash(self, key):
        row, col = key
        return (row * 31 + col) % self.size

    def put(self, key, plant):
        chain = self.buckets[self._hash(key)]
        for entry in chain:
            if entry[0] == key:                       # same plot: update the plant
                entry[1] = plant
                return
        chain.append([key, plant])                    # collision? just join the chain
        self.count += 1
        if self.count / self.size > self.MAX_LOAD:
            self._rehash()

    def get(self, key):
        for k, plant in self.buckets[self._hash(key)]:
            if k == key:
                return plant
        return None

    def remove(self, key):                            # harvest
        chain = self.buckets[self._hash(key)]
        for i, (k, _) in enumerate(chain):
            if k == key:
                chain.pop(i)
                self.count -= 1
                return True
        return False

    def _rehash(self):
        old = self.buckets
        self.size = next_prime(self.size * 2)         # about double, prime
        self.buckets = [[] for _ in range(self.size)]
        for chain in old:
            for key, plant in chain:                  # recompute index with the NEW size
                self.buckets[self._hash(key)].append([key, plant])
        self.rehash_count += 1
        print(f"  rehash #{self.rehash_count}: size {self.size}, load {self.count / self.size:.2f}")
        pushAction(f"Rehashed plot table to size {self.size}")

    def longest_chain(self):
        return max(len(c) for c in self.buckets)

# ==== WRITE YOUR CODE HERE ====
crops = ["Eggplant", "Tomato", "Carrot", "Corn", "Watermelon"]
table = PlotHashTable()

print("Planting a 5x5 garden into the hash table:")
for r in range(5):
    for c in range(5):
        crop = crops[(r + c) % 5]
        table.put((r, c), Plant(crop))
        if r == 0:
            addPlantToGrid(c, crop, "seed")           # show the first row on the garden grid
print("size", table.size, "| plants", table.count, "| longest chain", table.longest_chain())

p = table.get((2, 3))
print("Lookup plot (2,3):", p.crop, "| health", p.health, "| water", p.water, "| sun need", p.sun_need)
pushAction("Looked up plot (2,3) in the hash table")

print("Expanding the garden to 10x10:")
for r in range(10):
    for c in range(10):
        if table.get((r, c)) is None:
            table.put((r, c), Plant(crops[(r + c) % 5]))
print("size", table.size, "| plants", table.count, "| load %.2f" % (table.count / table.size), "| longest chain", table.longest_chain())
`
  },
  7: {
    title: "Topic 7: Graph Foundations (BFS/DFS)",
    code: `import json
from collections import deque
# Topic 7: Graph Foundations + BFS/DFS (opens the Path Explorer)
# The garden map: nodes = garden spots, edges = paths (number = walking/watering distance)
NODES = {"Gate": [10, 50], "Well": [35, 15], "Greenhouse": [35, 85],
         "Pond": [65, 15], "Barn": [65, 85], "Market": [90, 50]}
EDGES = [("Gate", "Well", 4), ("Gate", "Greenhouse", 2), ("Well", "Greenhouse", 1), ("Well", "Pond", 5),
         ("Greenhouse", "Barn", 3), ("Pond", "Market", 2), ("Barn", "Market", 6), ("Pond", "Barn", 8)]
graph = {n: [] for n in NODES}                 # adjacency LIST: node -> [(neighbor, distance), ...]
for a, b, w in EDGES:
    graph[a].append((b, w))
    graph[b].append((a, w))                    # undirected: add both directions

# ==== WRITE YOUR CODE HERE ====
def explore(algo, start="Gate"):
    """BFS uses a QUEUE (FIFO: popleft). DFS uses a STACK (LIFO: pop). Returns steps for the visualizer."""
    frontier, visited, steps = deque([start]), [], []
    seen = {start}
    while frontier:
        node = frontier.popleft() if algo == "bfs" else frontier.pop()
        visited.append(node)
        for nb, w in sorted(graph[node], reverse=(algo == "dfs")):
            if nb not in seen:                  # visit each spot only once
                seen.add(nb)
                frontier.append(nb)
        steps.append({"node": node, "frontier": list(frontier), "visited": list(visited)})
    return steps

for algo in ("bfs", "dfs"):
    print(algo.upper(), "order:", " -> ".join(s["node"] for s in explore(algo)))
openExplorer(json.dumps({"nodes": NODES, "edges": EDGES}), json.dumps(explore("bfs")), "BFS")
pushAction("Explored the garden graph (BFS and DFS)")
`
  },
  8: {
    title: "Topic 8: Sorting Algorithms (Insertion & Quick Sort)",
    code: `# Topic 8: Sorting the crop inventory (Insertion Sort) and the leaderboard (Quick Sort)
class Crop:
    def __init__(self, name, emoji, weight_kg, value, grow_days):
        self.name, self.emoji = name, emoji
        self.weight_kg, self.value, self.grow_days = weight_kg, value, grow_days

    def __repr__(self):
        return f"{self.emoji} {self.name}(w={self.weight_kg}kg, v={self.value}c, {self.grow_days}d)"

def insertion_sort(items, key):
    """BASIC sort: stable, in-place, O(n) on nearly sorted lists."""
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and key(items[j]) > key(current):    # shift bigger items right
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
    return items

def quick_sort(items, key, low=0, high=None):
    """ADVANCED sort: in-place, O(n log n) average, median-of-three pivot."""
    if high is None:
        high = len(items) - 1
    if low < high:
        mid = (low + high) // 2
        trio = sorted([low, mid, high], key=lambda i: key(items[i]))
        items[trio[1]], items[high] = items[high], items[trio[1]]
        pivot = key(items[high])
        i = low - 1
        for j in range(low, high):                        # partition (Lomuto)
            if key(items[j]) <= pivot:
                i += 1
                items[i], items[j] = items[j], items[i]
        items[i + 1], items[high] = items[high], items[i + 1]
        p = i + 1                                         # pivot is now in its final place
        quick_sort(items, key, low, p - 1)
        quick_sort(items, key, p + 1, high)
    return items

# ==== WRITE YOUR CODE HERE ====
inventory = [
    Crop("Watermelon", "🍉", 6.0, 80, 10), Crop("Carrot", "🥕", 0.2, 12, 4),
    Crop("Corn", "🌽", 0.5, 50, 9),        Crop("Tomato", "🍅", 0.3, 25, 6),
    Crop("Eggplant", "🍆", 0.4, 35, 7),
]

by_value = insertion_sort(inventory[:], key=lambda c: c.value)
print("Inventory by value (Insertion Sort):")
for c in by_value:
    print("  ", c)
pushAction("Sorted inventory by value: " + " < ".join(c.name for c in by_value))

by_days = insertion_sort(inventory[:], key=lambda c: c.grow_days)
pushAction("Sorted inventory by growth time: " + " < ".join(c.name for c in by_days))

scores = [("Ana", 420), ("Ben", 515), ("Cy", 380), ("Dee", 515), ("Eli", 610), ("Fay", 295)]
board = quick_sort(scores[:], key=lambda s: (-s[1], s[0]))    # high score first, ties by name
print("Leaderboard (Quick Sort):")
for rank, (name, pts) in enumerate(board, 1):
    print("  ", rank, name, pts)
pushAction("Ranked leaderboard (Quick Sort): #1 " + board[0][0] + " with " + str(board[0][1]))
`
  },
  9: {
    title: "Topic 9: Searching (Linear vs Binary)",
    code: `# Topic 9: Linear Search vs Binary Search on the market price list
prices = [("Carrot", 10), ("Tomato", 15), ("Eggplant", 20), ("Corn", 25), ("Watermelon", 30)]  # SORTED by price

def linear_search(items, target):               # O(n): check one by one
    for i, (name, p) in enumerate(items):
        if p == target:
            return i, i + 1                     # (index, comparisons)
    return -1, len(items)

def binary_search(items, target):               # O(log n): needs SORTED data, halve the range each time
    lo, hi, steps = 0, len(items) - 1, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steps += 1
        if items[mid][1] == target:
            return mid, steps
        if items[mid][1] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

# ==== WRITE YOUR CODE HERE ====
for target in (25, 30, 99):
    li, lc = linear_search(prices, target)
    bi, bc = binary_search(prices, target)
    print(f"price {target}c -> linear: {lc} comparisons | binary: {bc} comparisons")

big = [("crop" + str(i), i * 5) for i in range(1000)]     # 1000 sorted prices
print("1000 items, worst case -> linear:", linear_search(big, 4995)[1], "| binary:", binary_search(big, 4995)[1])

i, n = binary_search(prices, 25)                          # show the found crop on the garden grid
addPlantToGrid(i, prices[i][0])
pushAction("Binary search found " + prices[i][0] + " in " + str(n) + " steps")
`
  },
  10: {
    title: "Topic 10: Dijkstra & Greedy",
    code: `import json, heapq
# Topic 10: Dijkstra (shortest watering path) + Greedy (best crop per free plot)
# The garden map: nodes = garden spots, edges = paths (number = walking/watering distance)
NODES = {"Gate": [10, 50], "Well": [35, 15], "Greenhouse": [35, 85],
         "Pond": [65, 15], "Barn": [65, 85], "Market": [90, 50]}
EDGES = [("Gate", "Well", 4), ("Gate", "Greenhouse", 2), ("Well", "Greenhouse", 1), ("Well", "Pond", 5),
         ("Greenhouse", "Barn", 3), ("Pond", "Market", 2), ("Barn", "Market", 6), ("Pond", "Barn", 8)]
graph = {n: [] for n in NODES}                 # adjacency LIST: node -> [(neighbor, distance), ...]
for a, b, w in EDGES:
    graph[a].append((b, w))
    graph[b].append((a, w))                    # undirected: add both directions

# ==== WRITE YOUR CODE HERE ====
def explore(algo="dijkstra", start="Well"):
    """Dijkstra: always expand the closest unvisited spot (a priority queue / min-heap)."""
    dist = {n: float("inf") for n in graph}
    dist[start] = 0
    heap, done, steps = [(0, start)], [], []
    while heap:
        d, node = heapq.heappop(heap)
        if node in done:
            continue
        done.append(node)
        for nb, w in graph[node]:
            if d + w < dist[nb]:                # found a shorter route to nb
                dist[nb] = d + w
                heapq.heappush(heap, (dist[nb], nb))
        steps.append({"node": node, "frontier": [n + "(" + str(x) + ")" for x, n in sorted(heap)],
                      "visited": list(done), "dist": {k: v for k, v in dist.items() if v != float("inf")}})
    return steps

steps = explore()
print("Shortest watering distance from the Well:", steps[-1]["dist"])
openExplorer(json.dumps({"nodes": NODES, "edges": EDGES}), json.dumps(steps), "Dijkstra")
pushAction("Shortest path found from the Well (Dijkstra)")

# Greedy: with only 3 free plots, always take the crop with the best coins per growing day
CROPS = {"Carrot": (12, 4), "Tomato": (25, 6), "Eggplant": (35, 7), "Corn": (50, 9), "Watermelon": (80, 10)}  # coins, days
ranked = sorted(CROPS, key=lambda c: CROPS[c][0] / CROPS[c][1], reverse=True)
for plot, crop in enumerate(ranked[:3]):
    print("Greedy pick:", crop, "=", round(CROPS[crop][0] / CROPS[crop][1], 1), "coins/day")
    addPlantToGrid(plot, crop)
pushAction("Greedy pick for 3 plots: " + ", ".join(ranked[:3]))
`
  },
  11: {
    title: "Topic 11: Dynamic Programming & Memoization",
    code: `# Topic 11: Dynamic Programming + Memoization + Divide-and-Conquer
CROPS = {"Carrot": (12, 3), "Tomato": (25, 4), "Eggplant": (35, 5), "Corn": (50, 6), "Watermelon": (80, 9)}  # coins, water need
names = list(CROPS)
memo, calls = {}, 0

def best(i, water, use_memo=True):
    """Best coins from crops i.. with water left (0/1 knapsack). Memo = remember answers we already solved."""
    global calls
    calls += 1
    if i == len(names) or water <= 0:
        return 0
    if use_memo and (i, water) in memo:
        return memo[(i, water)]
    coins, need = CROPS[names[i]]
    skip = best(i + 1, water, use_memo)
    take = coins + best(i + 1, water - need, use_memo) if need <= water else 0
    memo[(i, water)] = max(skip, take)
    return memo[(i, water)]

def max_yield(vals, lo, hi):                    # Divide-and-Conquer: split the row in half, solve each half
    if lo == hi:
        return vals[lo]
    mid = (lo + hi) // 2
    return max(max_yield(vals, lo, mid), max_yield(vals, mid + 1, hi))

# ==== WRITE YOUR CODE HERE ====
WATER = 15
calls = 0; best(0, WATER, False); plain = calls
memo.clear(); calls = 0; total = best(0, WATER); memoized = calls
print("Best harvest with", WATER, "water:", total, "coins")
print("Recursive calls -> without memo:", plain, "| with memo:", memoized)

chosen, water = [], WATER
for i, n in enumerate(names):                   # walk the table to see which crops were taken
    if best(i, water) != best(i + 1, water):
        chosen.append(n)
        water -= CROPS[n][1]
print("Plant these:", chosen)
for plot, crop in enumerate(chosen):
    addPlantToGrid(plot, crop)
pushAction("DP plan: " + ", ".join(chosen) + " = " + str(total) + " coins")
print("Best single plot yield (divide-and-conquer):", max_yield([CROPS[n][0] for n in names], 0, len(names) - 1))

def fib(n, cache=None, stats=None):             # classic memoization demo: fib(25) without vs with memo
    stats[0] += 1
    if n < 2:
        return n
    if cache is not None and n in cache:
        return cache[n]
    r = fib(n - 1, cache, stats) + fib(n - 2, cache, stats)
    if cache is not None:
        cache[n] = r
    return r

a, b = [0], [0]
fib(25, None, a); fib(25, {}, b)
print("fib(25) calls -> without memo:", a[0], "| with memo:", b[0])
`
  }
};
