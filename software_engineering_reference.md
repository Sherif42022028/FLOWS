# Software Engineering — Professional Reference

> A complete reference for backend engineers, interview prep, and AI-assisted development.
> Covers fundamentals through senior-level architecture and production engineering.
>
> **How to use with AI models:** Paste this file as context before asking coding, architecture, or design questions.

---

## Table of Contents

1. [Object-Oriented Programming](#1-object-oriented-programming)
2. [Data Structures & Algorithms — Advanced](#2-data-structures--algorithms)
3. [System Design & Scalable Architecture](#3-system-design--scalable-architecture)
4. [Clean Architecture & Enterprise Patterns](#4-clean-architecture--enterprise-patterns)
5. [REST APIs & Backend Engineering](#5-rest-apis--backend-engineering)
6. [DevOps & Deployment](#6-devops--deployment)
7. [Testing & Software Quality](#7-testing--software-quality)
8. [Advanced Database Engineering](#8-advanced-database-engineering)
9. [Git & Team Collaboration](#9-git--team-collaboration)
10. [Security Fundamentals](#10-security-fundamentals)
11. [Design Patterns](#11-design-patterns)
12. [SOLID Principles](#12-solid-principles)
13. [AI-Assisted Development](#13-ai-assisted-development)
14. [Interview Quick Revision](#14-interview-quick-revision)
15. [Production Readiness Checklist](#15-production-readiness-checklist)
16. [Backend Engineering Roadmap](#16-backend-engineering-roadmap)
17. [Common Engineering Mistakes](#17-common-engineering-mistakes)
18. [Senior Engineer Notes](#18-senior-engineer-notes)

---

# 1. Object-Oriented Programming

## The 4 Pillars

### 1.1 Encapsulation
Bundling data and methods within one unit, restricting direct access to internal state.

```java
public class BankAccount {
    private double balance;
    private List<String> transactions = new ArrayList<>();

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
        transactions.add("Deposit: " + amount);
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
        transactions.add("Withdrawal: " + amount);
    }

    public double getBalance() { return balance; }
    public List<String> getTransactions() { return Collections.unmodifiableList(transactions); }
}
```

**Key points:**
- Use `private` fields + `public` getters/setters
- Validate in setters — protect invariants
- Return defensive copies of mutable objects
- Reduces coupling between classes

---

### 1.2 Inheritance
A child class acquires properties and behaviors from a parent class.

```java
public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat()  { System.out.println(name + " is eating"); }
    public String describe() { return "Animal: " + name; }
}

public class Dog extends Animal {
    private String breed;
    public Dog(String name, String breed) {
        super(name);
        this.breed = breed;
    }
    public void bark() { System.out.println(name + " says: Woof!"); }
    @Override
    public String describe() { return "Dog: " + name + " (" + breed + ")"; }
}
```

**Key points:**
- Creates IS-A relationship (Dog IS-A Animal)
- Use `super` to call parent constructor or methods
- Favor composition over deep inheritance
- Never inherit just to reuse code — use composition instead

---

### 1.3 Polymorphism
Same interface, different implementations at runtime.

```java
public abstract class Shape {
    public abstract double area();
    public abstract double perimeter();
    public String info() {
        return getClass().getSimpleName() + " | Area: " + String.format("%.2f", area());
    }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public double area()      { return Math.PI * radius * radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
}

public class Rectangle extends Shape {
    private double width, height;
    public Rectangle(double w, double h) { width = w; height = h; }
    public double area()      { return width * height; }
    public double perimeter() { return 2 * (width + height); }
}

// Runtime polymorphism
List<Shape> shapes = List.of(new Circle(5), new Rectangle(4, 6), new Circle(3));
shapes.forEach(s -> System.out.println(s.info()));
double totalArea = shapes.stream().mapToDouble(Shape::area).sum();
```

**Types:**
- **Compile-time:** Method Overloading — same name, different parameters
- **Runtime:** Method Overriding — different class, same signature

---

### 1.4 Abstraction
Hiding implementation details, exposing only what's necessary.

```java
// Abstract class — partial implementation
public abstract class DataProcessor {
    // Template method pattern
    public final void process() {
        readData();
        processData();   // abstract — subclass decides how
        writeData();
    }
    protected abstract void processData();
    private void readData()  { System.out.println("Reading data..."); }
    private void writeData() { System.out.println("Writing results..."); }
}

// Interface — pure contract
public interface Exportable {
    byte[] export();
    String getFormat();
    default String getFileName() { return "export_" + System.currentTimeMillis(); }
}
```

**Abstract Class vs Interface:**

| | Abstract Class | Interface |
|--|--|--|
| Methods | Concrete + abstract | Abstract (Java 8+: default/static) |
| Fields | Instance variables | Constants only |
| Inheritance | Single | Multiple |
| Constructor | Yes | No |
| Use when | Shared base behavior | Defining capabilities/contracts |

---

## OOP Advanced Concepts

### Composition over Inheritance
```java
// ❌ Deep inheritance — fragile
class Vehicle → Car → ElectricCar → TeslaModel3

// ✅ Composition — flexible
public class Car {
    private Engine engine;
    private Battery battery;
    private GPS gps;

    public Car(Engine engine, Battery battery, GPS gps) {
        this.engine  = engine;
        this.battery = battery;
        this.gps     = gps;
    }
    public void start()     { engine.start(); }
    public int getRange()   { return battery.getRange(); }
    public String locate()  { return gps.getLocation(); }
}
```

### Interfaces & Default Methods (Java 8+)
```java
public interface Auditable {
    default void logChange(String field, Object oldVal, Object newVal) {
        System.out.printf("[AUDIT] %s changed: %s → %s%n", field, oldVal, newVal);
    }
}

public interface Serializable {
    String toJson();
    static <T> T fromJson(String json, Class<T> type) { /* ... */ return null; }
}

public class User implements Auditable, Serializable {
    private String email;

    public void updateEmail(String newEmail) {
        logChange("email", this.email, newEmail); // from Auditable
        this.email = newEmail;
    }

    public String toJson() { return "{\"email\":\"" + email + "\"}"; }
}
```

### Generics
```java
public class Result<T> {
    private final T data;
    private final String error;
    private final boolean success;

    private Result(T data, String error, boolean success) {
        this.data = data; this.error = error; this.success = success;
    }

    public static <T> Result<T> ok(T data)        { return new Result<>(data, null, true); }
    public static <T> Result<T> fail(String error) { return new Result<>(null, error, false); }

    public boolean isSuccess() { return success; }
    public T getData()         { return data; }
    public String getError()   { return error; }
}

// Usage
Result<User> result = userService.findById(id);
if (result.isSuccess()) {
    System.out.println(result.getData().getName());
} else {
    System.out.println("Error: " + result.getError());
}
```

---

# 2. Data Structures & Algorithms

## 2.1 Core Data Structures

### Complexity Reference

| Structure | Access | Search | Insert | Delete | Space |
|-----------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Dynamic Array | O(1) | O(n) | O(1)* | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Map | N/A | O(1)* | O(1)* | O(1)* | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Heap | N/A | O(n) | O(log n) | O(log n) | O(n) |

*amortized average

---

### Stack (LIFO)
```java
// Useful for: undo/redo, call stack, bracket matching, DFS
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2); stack.push(3);
System.out.println(stack.pop());  // 3
System.out.println(stack.peek()); // 2

// Real example: Valid Parentheses (LeetCode 20)
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return stack.isEmpty();
}
```

### Queue (FIFO)
```java
// Useful for: BFS, task scheduling, print queue, sliding window
Queue<Integer> queue = new LinkedList<>();
queue.offer(1); queue.offer(2); queue.offer(3);
System.out.println(queue.poll());  // 1
System.out.println(queue.peek());  // 2
```

### HashMap & HashSet
```java
// Useful for: frequency count, dedup, two-sum, caching
Map<String, Integer> freq = new HashMap<>();
for (String word : words) {
    freq.merge(word, 1, Integer::sum); // elegant frequency count
}

// Two Sum (LeetCode 1) — O(n) solution
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement))
            return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

---

## 2.2 Trees & Graphs

### Binary Search Tree
```java
class BST {
    private TreeNode root;

    // Insert — O(log n) average
    public void insert(int val) { root = insert(root, val); }
    private TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left  = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node;
    }

    // Traversals
    public List<Integer> inorder()   { return inorder(root, new ArrayList<>()); }
    public List<Integer> preorder()  { return preorder(root, new ArrayList<>()); }
    public List<Integer> postorder() { return postorder(root, new ArrayList<>()); }

    private List<Integer> inorder(TreeNode node, List<Integer> result) {
        if (node == null) return result;
        inorder(node.left, result);
        result.add(node.val);
        inorder(node.right, result);
        return result;
    }
    // inorder → sorted output from BST
}
```

### Graph Representation
```java
// Adjacency List (preferred for sparse graphs)
class Graph {
    private int V;
    private Map<Integer, List<Integer>> adj;

    public Graph(int V) {
        this.V = V;
        adj = new HashMap<>();
        for (int i = 0; i < V; i++) adj.put(i, new ArrayList<>());
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u); // undirected
    }
}
```

### BFS (Breadth-First Search)
**Use for:** Shortest path (unweighted), level-order traversal, connected components

```java
// Time: O(V + E) | Space: O(V)
public List<Integer> bfs(Graph g, int start) {
    List<Integer> order = new ArrayList<>();
    boolean[] visited = new boolean[g.V];
    Queue<Integer> queue = new LinkedList<>();

    visited[start] = true;
    queue.offer(start);

    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int neighbor : g.adj.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
    return order;
}

// Shortest path using BFS
public int shortestPath(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    boolean[][] visited = new boolean[rows][cols];
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{start[0], start[1], 0});
    visited[start[0]][start[1]] = true;

    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        int r = curr[0], c = curr[1], dist = curr[2];
        if (r == end[0] && c == end[1]) return dist;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && grid[nr][nc] == 0) {
                visited[nr][nc] = true;
                queue.offer(new int[]{nr, nc, dist + 1});
            }
        }
    }
    return -1; // no path
}
```

### DFS (Depth-First Search)
**Use for:** Cycle detection, topological sort, path finding, connected components

```java
// Recursive DFS — Time: O(V + E) | Space: O(V)
public void dfs(int node, boolean[] visited, Map<Integer, List<Integer>> adj) {
    visited[node] = true;
    System.out.print(node + " ");
    for (int neighbor : adj.getOrDefault(node, Collections.emptyList())) {
        if (!visited[neighbor]) dfs(neighbor, visited, adj);
    }
}

// Iterative DFS
public List<Integer> dfsIterative(int start, Map<Integer, List<Integer>> adj, int V) {
    List<Integer> order = new ArrayList<>();
    boolean[] visited = new boolean[V];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited[node]) {
            visited[node] = true;
            order.add(node);
            for (int neighbor : adj.getOrDefault(node, Collections.emptyList()))
                if (!visited[neighbor]) stack.push(neighbor);
        }
    }
    return order;
}

// Number of Islands (LeetCode 200) — classic DFS on grid
public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++)
        for (int j = 0; j < grid[0].length; j++)
            if (grid[i][j] == '1') { dfsSink(grid, i, j); count++; }
    return count;
}
private void dfsSink(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0'; // mark visited by sinking
    dfsSink(grid, r+1, c); dfsSink(grid, r-1, c);
    dfsSink(grid, r, c+1); dfsSink(grid, r, c-1);
}
```

---

## 2.3 Heap & Priority Queue
**Use for:** Top K elements, median, Dijkstra's, scheduling

```java
// Min-heap
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

minHeap.offer(5); minHeap.offer(1); minHeap.offer(3);
System.out.println(minHeap.poll()); // 1 (smallest)

// Top K Frequent Elements (LeetCode 347)
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    // Min-heap of size k
    PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.comparingInt(freq::get));
    for (int num : freq.keySet()) {
        heap.offer(num);
        if (heap.size() > k) heap.poll();
    }
    return heap.stream().mapToInt(Integer::intValue).toArray();
}
```

---

## 2.4 Dynamic Programming
**Pattern:** Optimal substructure + overlapping subproblems

### Memoization (Top-Down)
```java
// Fibonacci with memoization
public long fib(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}
// Time: O(n) | Space: O(n)

// Coin Change (LeetCode 322)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // infinity
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i)
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}

// Longest Common Subsequence (LeetCode 1143)
public int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = s1.charAt(i-1) == s2.charAt(j-1)
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

### DP Problem Categories
| Pattern | Examples |
|---------|---------|
| 1D DP | Fibonacci, Climbing Stairs, House Robber |
| 2D DP | LCS, Edit Distance, 0/1 Knapsack |
| Interval DP | Matrix Chain Multiplication, Burst Balloons |
| String DP | Palindrome Substrings, Word Break |

---

## 2.5 Sliding Window
**Use for:** Subarray/substring problems with a constraint

```java
// Max sum subarray of size k — O(n)
public int maxSumSubarray(int[] arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k) windowSum -= arr[i - k];
        if (i >= k - 1) maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}

// Longest substring without repeating chars (LeetCode 3)
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c) && map.get(c) >= left)
            left = map.get(c) + 1;
        map.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

---

## 2.6 Two Pointers
**Use for:** Sorted arrays, palindromes, pair sum problems

```java
// Container with most water (LeetCode 11)
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, max = 0;
    while (left < right) {
        max = Math.max(max, Math.min(height[left], height[right]) * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return max;
}

// 3Sum (LeetCode 15)
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue; // skip duplicates
        int left = i+1, right = nums.length-1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(List.of(nums[i], nums[left++], nums[right--]));
                while (left < right && nums[left] == nums[left-1]) left++;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}
```

---

## 2.7 Backtracking
**Template:**
```java
public void backtrack(state, choices) {
    if (isGoal(state)) { addToResult(); return; }
    for (choice : choices) {
        if (isValid(choice)) {
            makeChoice(choice);
            backtrack(nextState, remainingChoices);
            undoChoice(choice);   // ← KEY: undo!
        }
    }
}

// Permutations (LeetCode 46)
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrackPermute(nums, new ArrayList<>(), new boolean[nums.length], result);
    return result;
}
private void backtrackPermute(int[] nums, List<Integer> current, boolean[] used, List<List<Integer>> result) {
    if (current.size() == nums.length) { result.add(new ArrayList<>(current)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        current.add(nums[i]);
        backtrackPermute(nums, current, used, result);
        current.remove(current.size()-1);
        used[i] = false;
    }
}
```

---

## 2.8 Greedy Algorithms
**Use when:** Local optimal choice leads to global optimal

```java
// Activity Selection — schedule max non-overlapping activities
public int maxActivities(int[] start, int[] end) {
    // Sort by end time
    int n = start.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, Comparator.comparingInt(i -> end[i]));

    int count = 1, lastEnd = end[idx[0]];
    for (int i = 1; i < n; i++) {
        if (start[idx[i]] >= lastEnd) {
            count++;
            lastEnd = end[idx[i]];
        }
    }
    return count;
}

// Jump Game (LeetCode 55)
public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

---

## 2.9 Trie (Prefix Tree)
**Use for:** Autocomplete, spell check, prefix search

```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}

class Trie {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (curr.children[i] == null) curr.children[i] = new TrieNode();
            curr = curr.children[i];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private TrieNode find(String s) {
        TrieNode curr = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (curr.children[i] == null) return null;
            curr = curr.children[i];
        }
        return curr;
    }
}
```

---

## 2.10 Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable | Notes |
|-----------|------|---------|-------|-------|--------|-------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✅ | Teaching only |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | ❌ | Min writes |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✅ | Good for small/nearly sorted |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | External sort |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | In-place, fast in practice |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | Guaranteed O(n log n) |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ | Integer keys only |

```java
// Merge Sort — divide and conquer
public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid+1, right);
    merge(arr, left, mid, right);
}
private void merge(int[] arr, int left, int mid, int right) {
    int[] temp = Arrays.copyOfRange(arr, left, right+1);
    int i = 0, j = mid - left + 1, k = left;
    while (i <= mid - left && j <= right - left)
        arr[k++] = temp[i] <= temp[j] ? temp[i++] : temp[j++];
    while (i <= mid - left) arr[k++] = temp[i++];
    while (j <= right - left) arr[k++] = temp[j++];
}
```

---

## 2.11 Big O — Quick Reference

| Notation | Name | Example | 1M ops takes |
|----------|------|---------|-------------|
| O(1) | Constant | Array access, HashMap get | ~1ns |
| O(log n) | Logarithmic | Binary search | ~20ns |
| O(n) | Linear | Linear scan | ~1ms |
| O(n log n) | Linearithmic | Merge/Quick sort | ~20ms |
| O(n²) | Quadratic | Nested loops | ~1s |
| O(2ⁿ) | Exponential | Subset generation | forever |
| O(n!) | Factorial | All permutations | forever |


---

# 3. System Design & Scalable Architecture

## 3.1 Monolith vs Microservices

```
MONOLITH                          MICROSERVICES
┌─────────────────────┐           ┌──────────┐  ┌──────────┐
│                     │           │  User    │  │  Order   │
│  UI + API +         │           │ Service  │  │ Service  │
│  Business Logic +   │   vs.     └────┬─────┘  └────┬─────┘
│  Data Access        │                │              │
│  (one deployable)   │           ┌────▼─────┐  ┌────▼─────┐
│                     │           │  User DB │  │ Order DB │
└─────────────────────┘           └──────────┘  └──────────┘
```

| | Monolith | Microservices |
|--|----------|--------------|
| Deployment | Single unit | Independent services |
| Scaling | Scale entire app | Scale per service |
| Complexity | Low (start) | High (operational) |
| Data | Single DB | DB per service |
| Communication | In-process | HTTP/gRPC/Queue |
| Failure | One failure = all down | Isolated failures |
| Team | Small teams | Multiple teams |
| Use when | Startup, unknown domain | Scale needed, clear boundaries |

**Rule:** Start with a monolith. Break into microservices when you have clear domain boundaries and scaling requirements.

---

## 3.2 Load Balancer

```
                    ┌─────────────────┐
Clients ──────────► │  Load Balancer  │
                    └────────┬────────┘
               ┌─────────────┼─────────────┐
               ▼             ▼             ▼
          ┌─────────┐  ┌─────────┐  ┌─────────┐
          │ Server1 │  │ Server2 │  │ Server3 │
          └─────────┘  └─────────┘  └─────────┘
```

**Algorithms:**
- **Round Robin** — requests distributed evenly in order
- **Weighted Round Robin** — stronger servers get more requests
- **Least Connections** — route to server with fewest active connections
- **IP Hash** — same client always hits same server (session stickiness)
- **Random** — simple random selection

**Layer 4 vs Layer 7:**
- L4 (Transport) — routes based on IP/TCP, fast, no content inspection
- L7 (Application) — routes based on URL, headers, cookies, can do SSL termination

**Tools:** AWS ALB/NLB, Nginx, HAProxy, Traefik

---

## 3.3 API Gateway

```
                    ┌─────────────────────────┐
                    │       API Gateway        │
                    │  • Auth/JWT validation   │
                    │  • Rate limiting         │
                    │  • Request routing       │
                    │  • SSL termination       │
                    │  • Logging/monitoring    │
                    └───────────┬─────────────┘
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
     │ User Service│   │Order Service│   │ Pay Service │
     └─────────────┘   └─────────────┘   └─────────────┘
```

**Responsibilities:**
- Single entry point for all clients
- Auth validation (offload from services)
- Rate limiting per client/endpoint
- Request/response transformation
- Aggregation of multiple service calls

**Tools:** AWS API Gateway, Kong, Nginx, Traefik, Spring Cloud Gateway

---

## 3.4 CDN (Content Delivery Network)

```
Origin Server                    CDN Edge Nodes
┌──────────┐     cache      ┌──────────┐   ┌──────────┐
│  origin  │◄───────────────│ edge-US  │   │ edge-EU  │
│  server  │                └────▲─────┘   └────▲─────┘
└──────────┘                     │              │
                            US users        EU users
```

- Static assets served from nearest node
- Reduces latency (edge is geographically closer)
- Reduces load on origin server
- Built-in DDoS protection

**What to cache:** Images, JS/CSS, fonts, videos, static HTML
**What NOT to cache:** API responses with user-specific data, real-time data

**TTL Strategy:**
```
/static/images/*   → Cache-Control: max-age=31536000 (1 year, hash in URL)
/api/public/*      → Cache-Control: max-age=300 (5 minutes)
/api/user/*        → Cache-Control: no-store (private)
```

---

## 3.5 Caching

```
Request Flow:
Client → App → Cache? → YES → return cached data
                      → NO  → DB → store in cache → return data
```

### Cache Strategies

| Strategy | Description | Use case |
|----------|-------------|---------|
| Cache-Aside | App manages cache manually | Most common, flexible |
| Write-Through | Write to cache + DB simultaneously | Read-heavy, consistency needed |
| Write-Behind | Write to cache, async DB write | Write-heavy, tolerate lag |
| Read-Through | Cache sits in front, fetches from DB | Transparent to app |

### Redis Examples
```java
// Spring Boot + Redis
@Service
public class UserService {
    @Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @CacheEvict(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}

// Redis directly
RedisTemplate<String, Object> redis; // inject

// String operations
redis.opsForValue().set("session:abc123", userId, Duration.ofHours(24));
String userId = (String) redis.opsForValue().get("session:abc123");

// Increment (atomic — perfect for rate limiting)
Long count = redis.opsForValue().increment("ratelimit:" + ip);

// List operations (queues)
redis.opsForList().rightPush("tasks", task);
Object next = redis.opsForList().leftPop("tasks");

// Sets (unique members)
redis.opsForSet().add("online_users", userId);
Set<Object> onlineUsers = redis.opsForSet().members("online_users");

// Hash (object storage)
redis.opsForHash().put("user:42", "name", "Ahmed");
redis.opsForHash().put("user:42", "email", "ahmed@co.com");
```

### Cache Invalidation Strategies
```
TTL-based:    Set expiry on every key. Simple but stale data possible.
Event-based:  Invalidate on write. Consistent but complex.
Tag-based:    Group keys by tag, invalidate by tag. Flexible.
```

**Cache Pitfalls:**
- **Cache Stampede:** Many requests hit DB simultaneously after cache miss → use locks or probabilistic early expiry
- **Thundering Herd:** Cache expires, flood of requests → stagger TTLs with jitter
- **Cache Penetration:** Query for non-existent keys repeatedly → cache null values or use Bloom filters

---

## 3.6 Database Scaling

### Vertical vs Horizontal Scaling

```
Vertical Scaling (Scale Up)          Horizontal Scaling (Scale Out)
┌──────────────┐                     ┌──────┐ ┌──────┐ ┌──────┐
│              │                     │  DB1 │ │  DB2 │ │  DB3 │
│  Bigger box  │         vs.         └──────┘ └──────┘ └──────┘
│  (CPU/RAM)   │                         └────────┬────────┘
│              │                                  │
└──────────────┘                           Distributed
```

| | Vertical | Horizontal |
|--|----------|-----------|
| Complexity | Low | High |
| Cost | Exponential | Linear |
| Limit | Hardware ceiling | Theoretically unlimited |
| Downtime | Required | None (add nodes) |
| Data consistency | Easy | Challenging |

---

### Replication
```
Primary-Replica (Read Replicas):
┌─────────┐    replicate    ┌──────────┐  ┌──────────┐
│ Primary │ ──────────────► │ Replica1 │  │ Replica2 │
│  (R/W)  │                 │ (R only) │  │ (R only) │
└─────────┘                 └──────────┘  └──────────┘
```

- All writes → Primary
- All reads → Replicas (distribute read load)
- Replication lag is a concern (eventual consistency)
- Failover: promote replica to primary on primary failure

---

### Sharding (Horizontal Partitioning)
```
Shard by user_id:
User 1-33%   → Shard 1 (DB1)
User 34-66%  → Shard 2 (DB2)
User 67-100% → Shard 3 (DB3)
```

**Sharding Strategies:**
- **Range-based:** Shard by ID range. Simple, but hot spots possible.
- **Hash-based:** `shard = hash(key) % numShards`. Even distribution.
- **Directory-based:** Lookup table maps key → shard. Flexible, extra hop.

**Challenges:**
- Cross-shard queries are expensive
- Re-sharding when adding nodes is complex
- Transactions across shards require distributed coordination

---

## 3.7 Message Queues

```
Producer  →  [Queue]  →  Consumer
              Buffer
```

**Why use queues:**
- Decouple services (producer doesn't wait for consumer)
- Handle traffic spikes (queue absorbs burst)
- Retry failed operations
- Parallel processing

### RabbitMQ (Message Broker)
```java
// Publish
@Autowired RabbitTemplate rabbitTemplate;

public void sendOrderEvent(Order order) {
    rabbitTemplate.convertAndSend("orders.exchange", "order.created", order);
}

// Consume
@RabbitListener(queues = "order-processing-queue")
public void processOrder(Order order) {
    System.out.println("Processing order: " + order.getId());
    // process...
    // message auto-acked on success, requeued on exception
}
```

### Kafka (Event Streaming)
```java
// Produce
@Autowired KafkaTemplate<String, String> kafkaTemplate;

public void publishEvent(String topic, String payload) {
    kafkaTemplate.send(topic, payload)
        .addCallback(
            success -> log.info("Sent: " + success.getRecordMetadata().offset()),
            failure -> log.error("Failed: " + failure.getMessage())
        );
}

// Consume
@KafkaListener(topics = "user-events", groupId = "notification-service")
public void handleUserEvent(String payload) {
    // all messages are retained — replay possible
    // ordered within a partition
}
```

### RabbitMQ vs Kafka

| | RabbitMQ | Kafka |
|--|----------|-------|
| Model | Message broker (push) | Event log (pull) |
| Message retention | Deleted after ack | Retained (configurable) |
| Ordering | Per queue | Per partition |
| Throughput | Moderate | Very high |
| Replay | No | Yes |
| Use case | Task queues, RPC | Event sourcing, audit log, stream processing |

---

## 3.8 Event-Driven Architecture

```
Services communicate via events, not direct calls:

Order Service ──event──► [Event Bus] ──► Inventory Service
                                    ──► Notification Service
                                    ──► Analytics Service
```

```java
// Domain Event
public class OrderPlacedEvent {
    private String orderId;
    private String userId;
    private List<OrderItem> items;
    private Instant occurredAt = Instant.now();
}

// Publisher
@Service
public class OrderService {
    @Autowired ApplicationEventPublisher eventPublisher;

    public Order placeOrder(OrderRequest req) {
        Order order = createOrder(req);
        orderRepository.save(order);
        eventPublisher.publishEvent(new OrderPlacedEvent(order));
        return order;
    }
}

// Handler
@Component
public class InventoryHandler {
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        event.getItems().forEach(item ->
            inventoryService.reserve(item.getSku(), item.getQuantity())
        );
    }
}
```

**Advantages:** Loose coupling, scalability, easy to add new handlers
**Challenges:** Eventual consistency, harder to trace flows, event ordering

---

## 3.9 WebSockets & Real-Time

```
HTTP (Request-Response):          WebSocket (Full-Duplex):
Client ──GET /data──► Server      Client ◄──────────────► Server
Client ◄──response── Server       (persistent connection, bidirectional)
```

```java
// Spring WebSocket
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}

@Controller
public class ChatController {
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        return message; // broadcast to all subscribers
    }
}
```

**Long Polling (fallback):**
```java
// Client polls server repeatedly
// Server holds request open until data available or timeout
@GetMapping("/events/poll")
public DeferredResult<ResponseEntity<Event>> pollEvents() {
    DeferredResult<ResponseEntity<Event>> result = new DeferredResult<>(30_000L);
    eventQueue.addListener(event -> result.setResult(ResponseEntity.ok(event)));
    result.onTimeout(() -> result.setResult(ResponseEntity.noContent().build()));
    return result;
}
```

---

## 3.10 Rate Limiting

```java
// Token Bucket algorithm with Redis
@Component
public class RateLimiter {
    private static final int MAX_REQUESTS = 100;
    private static final int WINDOW_SECONDS = 60;

    @Autowired RedisTemplate<String, String> redis;

    public boolean isAllowed(String clientId) {
        String key = "ratelimit:" + clientId;
        Long count = redis.opsForValue().increment(key);
        if (count == 1) redis.expire(key, Duration.ofSeconds(WINDOW_SECONDS));
        return count <= MAX_REQUESTS;
    }
}

// Middleware
@Component
public class RateLimitFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String ip = req.getRemoteAddr();
        if (!rateLimiter.isAllowed(ip)) {
            res.setStatus(429);
            res.getWriter().write("{\"error\":\"Too Many Requests\"}");
            return;
        }
        chain.doFilter(req, res);
    }
}
```

---

## 3.11 Circuit Breaker

```
CLOSED (normal)  ──too many failures──►  OPEN (fail fast)
                                              │
                                        after timeout
                                              │
                                              ▼
                                    HALF-OPEN (probe)
                                     success ► CLOSED
                                     failure ► OPEN
```

```java
// Resilience4j
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
@Retry(name = "paymentService")
@TimeLimiter(name = "paymentService")
public CompletableFuture<PaymentResult> processPayment(PaymentRequest req) {
    return CompletableFuture.supplyAsync(() -> paymentClient.charge(req));
}

public CompletableFuture<PaymentResult> paymentFallback(PaymentRequest req, Exception e) {
    log.error("Payment service failed, using fallback", e);
    return CompletableFuture.completedFuture(PaymentResult.queued(req.getId()));
}
```

---

## 3.12 CAP Theorem

```
        Consistency
             /\
            /  \
           /    \
          /  CA  \
         /--------\
        / CP |  AP \
       /_____|______\
  Partition Tolerance   Availability
```

**In a distributed system with network partition, you must choose:**
- **CP (Consistency + Partition Tolerance):** MongoDB, HBase, Zookeeper — returns error over stale data
- **AP (Availability + Partition Tolerance):** Cassandra, DynamoDB, CouchDB — returns possibly stale data
- **CA (Consistency + Availability):** Traditional RDBMS — only works without partitions

**PACELC (extended model):** Even without partition, trade-off between Latency and Consistency

---

## 3.13 High Availability & Fault Tolerance

**HA Patterns:**
```
Active-Active:    Both nodes handle traffic simultaneously
Active-Passive:   One handles traffic, other on standby (failover)
Multi-Region:     Deployed in multiple geographic regions
```

**Key Metrics:**
| Metric | Formula | 99.9% ("three nines") | 99.99% ("four nines") |
|--------|---------|----------------------|----------------------|
| Uptime/year | - | 8.7 hours downtime | 52 minutes downtime |
| SLA target | uptime/total time | Most APIs | Financial systems |

**Fault Tolerance Techniques:**
- Retries with exponential backoff + jitter
- Timeouts on every external call
- Circuit breakers
- Bulkhead pattern (isolate failures)
- Graceful degradation (serve partial data)
- Health checks + automatic replacement

---

## System Design Interview Framework

```
1. Clarify requirements (functional + non-functional)
   → "How many users? Read-heavy or write-heavy? Latency requirements?"

2. Estimate scale
   → "10M users, 100 req/sec reads, 10 req/sec writes, 1KB average payload"

3. Define API
   → GET /posts/{id}, POST /posts, etc.

4. High-level design
   → Draw boxes: Client → LB → API → Cache → DB

5. Deep dive
   → Pick 2-3 components and go deep

6. Bottlenecks & trade-offs
   → "What breaks at 10x scale? What would I optimize next?"
```

---

# 4. Clean Architecture & Enterprise Patterns

## 4.1 Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer           │  Controllers, REST endpoints
├─────────────────────────────────────┤
│          Application Layer           │  Use cases, DTOs, validation
├─────────────────────────────────────┤
│           Domain Layer               │  Business logic, entities, rules
├─────────────────────────────────────┤
│        Infrastructure Layer          │  DB, external APIs, messaging
└─────────────────────────────────────┘
         (dependency goes downward only)
```

**Rule:** Each layer only depends on the layer directly below it. Infrastructure depends on nothing above it.

---

## 4.2 Clean Architecture

```
         ┌───────────────────────────┐
         │      Frameworks/Drivers    │  ← Spring, JPA, Redis
         │  ┌─────────────────────┐  │
         │  │   Interface Adapters │  │  ← Controllers, Presenters, Gateways
         │  │  ┌───────────────┐  │  │
         │  │  │  Application  │  │  │  ← Use Cases, DTOs
         │  │  │  ┌─────────┐  │  │  │
         │  │  │  │ Domain  │  │  │  │  ← Entities, Business Rules
         │  │  │  └─────────┘  │  │  │
         │  │  └───────────────┘  │  │
         │  └─────────────────────┘  │
         └───────────────────────────┘
         Dependency Rule: Always inward ←
```

### Folder Structure (Spring Boot Clean Architecture)
```
src/main/java/com/app/
├── domain/
│   ├── entity/           User.java, Order.java
│   ├── repository/       UserRepository.java (interface)
│   ├── service/          UserDomainService.java
│   └── exception/        UserNotFoundException.java
│
├── application/
│   ├── usecase/          CreateUserUseCase.java
│   ├── dto/              CreateUserRequest.java, UserResponse.java
│   └── port/
│       ├── in/           CreateUserPort.java (interface)
│       └── out/          SaveUserPort.java (interface)
│
├── infrastructure/
│   ├── persistence/      UserJpaRepository.java
│   ├── messaging/        KafkaEventPublisher.java
│   └── external/         EmailClient.java
│
└── presentation/
    ├── rest/             UserController.java
    └── mapper/           UserMapper.java
```

---

## 4.3 Repository Pattern

```java
// Domain interface (no framework dependency)
public interface UserRepository {
    Optional<User> findById(Long id);
    List<User> findByEmail(String email);
    User save(User user);
    void delete(Long id);
}

// Infrastructure implementation
@Repository
public class JpaUserRepository implements UserRepository {
    @Autowired private UserJpaRepository jpa; // Spring Data JPA
    @Autowired private UserMapper mapper;

    public Optional<User> findById(Long id) {
        return jpa.findById(id).map(mapper::toDomain);
    }

    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        return mapper.toDomain(jpa.save(entity));
    }
}

// Usage in service — no JPA dependency
@Service
public class UserService {
    private final UserRepository userRepository; // injects JpaUserRepository

    public UserResponse getUser(Long id) {
        return userRepository.findById(id)
            .map(UserResponse::from)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}
```

---

## 4.4 DTO Pattern

```java
// Entity (domain/database model)
@Entity
public class User {
    @Id Long id;
    String name;
    String email;
    String passwordHash;
    LocalDateTime createdAt;
    // more internal fields...
}

// Request DTO (what API accepts)
@Valid
public record CreateUserRequest(
    @NotBlank @Size(min=2, max=100) String name,
    @Email @NotBlank String email,
    @NotBlank @Size(min=8) String password
) {}

// Response DTO (what API returns — no sensitive fields)
public record UserResponse(Long id, String name, String email, String createdAt) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(), user.getName(), user.getEmail(),
            user.getCreatedAt().toString()
        );
    }
}
```

---

## 4.5 Dependency Injection

```java
// Constructor Injection (preferred)
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    // @Autowired optional if only one constructor
    public OrderService(OrderRepository orderRepository,
                        PaymentService paymentService,
                        NotificationService notificationService) {
        this.orderRepository       = orderRepository;
        this.paymentService        = paymentService;
        this.notificationService   = notificationService;
    }
}

// Configuration-based (for third-party classes)
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }

    @Bean
    @Profile("production")
    public EmailService emailService(@Value("${smtp.host}") String host) {
        return new SmtpEmailService(host);
    }

    @Bean
    @Profile("test")
    public EmailService emailService() {
        return new MockEmailService();
    }
}
```

---

## 4.6 CQRS Basics

```
Command Query Responsibility Segregation:

Commands (write):               Queries (read):
CreateOrderCommand  ──►         OrderSummaryQuery ──►
UpdateUserCommand   ──►   DB    UserDetailsQuery  ──►  Read DB
DeleteProductCommand──►         ProductListQuery  ──►  (denormalized)
       │                                               (optimized for reading)
       └── writes to write model
```

```java
// Command (changes state — returns void or ID)
public record CreateOrderCommand(Long userId, List<OrderItem> items) {}

// Query (returns data — no side effects)
public record GetOrderQuery(Long orderId) {}

// Command Handler
@Component
public class CreateOrderCommandHandler {
    public Long handle(CreateOrderCommand cmd) {
        Order order = new Order(cmd.userId(), cmd.items());
        return orderRepository.save(order).getId();
    }
}

// Query Handler (can use different repository, optimized view)
@Component
public class GetOrderQueryHandler {
    public OrderSummaryDTO handle(GetOrderQuery query) {
        return orderReadRepository.findSummaryById(query.orderId());
    }
}
```

---

## 4.7 Domain-Driven Design Basics

**Key concepts:**
- **Entity:** Has identity (ID), mutable state — `User`, `Order`
- **Value Object:** No identity, defined by its attributes, immutable — `Money`, `Address`, `Email`
- **Aggregate:** Cluster of entities with a root — `Order` aggregate contains `OrderItems`
- **Domain Service:** Business logic that doesn't fit in an entity
- **Repository:** Persistence abstraction for aggregates
- **Domain Event:** Something that happened — `OrderPlaced`, `PaymentFailed`
- **Bounded Context:** Clear boundary where a model applies — Billing, Shipping, Inventory

```java
// Value Object
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;

    public Money(BigDecimal amount, Currency currency) {
        if (amount.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Money cannot be negative");
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalStateException("Currency mismatch");
        return new Money(this.amount.add(other.amount), this.currency);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Money m)) return false;
        return amount.equals(m.amount) && currency.equals(m.currency);
    }
}

// Aggregate Root
public class Order {
    private final OrderId id;
    private final CustomerId customerId;
    private List<OrderLine> orderLines = new ArrayList<>();
    private OrderStatus status = OrderStatus.DRAFT;
    private Money total;
    private List<DomainEvent> events = new ArrayList<>();

    public void addItem(Product product, int quantity) {
        if (status != OrderStatus.DRAFT) throw new IllegalStateException("Order already submitted");
        orderLines.add(new OrderLine(product, quantity));
        recalculateTotal();
    }

    public void submit() {
        if (orderLines.isEmpty()) throw new BusinessException("Cannot submit empty order");
        status = OrderStatus.SUBMITTED;
        events.add(new OrderSubmittedEvent(id, customerId, total));
    }
}
```

---

# 5. REST APIs & Backend Engineering

## 5.1 HTTP Methods

| Method | Use | Body | Idempotent | Safe |
|--------|-----|------|-----------|------|
| GET | Retrieve resource | No | ✅ | ✅ |
| POST | Create resource | Yes | ❌ | ❌ |
| PUT | Replace resource | Yes | ✅ | ❌ |
| PATCH | Partial update | Yes | ❌ | ❌ |
| DELETE | Remove resource | No | ✅ | ❌ |
| HEAD | Like GET, no body | No | ✅ | ✅ |
| OPTIONS | Describe options | No | ✅ | ✅ |

---

## 5.2 HTTP Status Codes

| Code | Meaning | When to use |
|------|---------|------------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 301 | Moved Permanently | Permanent redirect |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Semantic validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Server down/overloaded |

---

## 5.3 REST API Design Best Practices

```
✅ Good REST Design:

GET    /users              → list all users
GET    /users/{id}         → get specific user
POST   /users              → create user
PUT    /users/{id}         → replace user
PATCH  /users/{id}         → update partial fields
DELETE /users/{id}         → delete user

GET    /users/{id}/orders  → get orders for user
POST   /users/{id}/orders  → create order for user

❌ Bad REST Design:
GET    /getUsers
POST   /createUser
GET    /deleteUser?id=5
POST   /users/doLogin
```

### Standard Error Response
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2025-01-15T10:30:00Z",
  "path": "/api/v1/users",
  "errors": [
    { "field": "email", "message": "must be a valid email address" },
    { "field": "name",  "message": "size must be between 2 and 100" }
  ]
}
```

### Global Exception Handler (Spring Boot)
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                          HttpServletRequest req) {
        List<FieldError> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(e -> new FieldError(e.getField(), e.getDefaultMessage()))
            .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(
            new ErrorResponse(400, "Validation failed", req.getRequestURI(), errors)
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex,
                                                        HttpServletRequest req) {
        return ResponseEntity.status(404).body(
            new ErrorResponse(404, ex.getMessage(), req.getRequestURI(), null)
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(500).body(
            new ErrorResponse(500, "Internal server error", req.getRequestURI(), null)
        );
    }
}
```

---

## 5.4 JWT Authentication

```
Flow:
1. Client: POST /auth/login  { username, password }
2. Server: validates → generates JWT → returns token
3. Client: stores token (localStorage / HttpOnly cookie)
4. Client: every request → Authorization: Bearer <token>
5. Server: validates token signature → extracts claims → processes request
```

```java
// JWT Utility
@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiry}") private long expiry; // milliseconds

    public String generate(String username, List<String> roles) {
        return Jwts.builder()
            .setSubject(username)
            .claim("roles", roles)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiry))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    public Claims validate(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}

// Security Filter
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwtUtil.validate(token);
                // Set authentication context
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(claims.getSubject(), null,
                        getRoles(claims));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException e) {
                res.sendError(401, "Invalid or expired token");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}
```

---

## 5.5 Pagination

```java
// Cursor-based pagination (better for large datasets)
public record PageRequest(String cursor, int size) {}

public record PageResponse<T>(
    List<T> data,
    String nextCursor,
    boolean hasMore
) {}

@GetMapping("/posts")
public ResponseEntity<PageResponse<PostDTO>> getPosts(
    @RequestParam(defaultValue = "") String cursor,
    @RequestParam(defaultValue = "20") @Max(100) int size
) {
    List<Post> posts = postRepository.findWithCursor(cursor, size + 1);
    boolean hasMore = posts.size() > size;
    if (hasMore) posts.remove(posts.size()-1);

    String nextCursor = hasMore ? encodeBase64(posts.get(posts.size()-1).getId()) : null;
    return ResponseEntity.ok(new PageResponse<>(toDTO(posts), nextCursor, hasMore));
}

// Offset-based (simpler, has performance issues at high offset)
@GetMapping("/users")
public Page<UserDTO> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt,desc") String sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
    return userRepository.findAll(pageable).map(UserDTO::from);
}
```

---

## 5.6 API Versioning

```java
// URL versioning (most common)
@RequestMapping("/api/v1/users")
public class UserControllerV1 { ... }

@RequestMapping("/api/v2/users")
public class UserControllerV2 { ... }

// Header versioning
@GetMapping(value = "/users", headers = "API-Version=2")
public ResponseEntity<UserResponseV2> getUsersV2() { ... }

// Accept header versioning
@GetMapping(value = "/users", produces = "application/vnd.app.v2+json")
public ResponseEntity<UserResponseV2> getUsersV2() { ... }
```

---

## 5.7 Middleware

```java
// Request logging middleware
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        long start = System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId); // correlate logs

        try {
            chain.doFilter(req, res);
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("{} {} {} {}ms [{}]",
                req.getMethod(), req.getRequestURI(),
                res.getStatus(), duration, requestId);
            MDC.clear();
        }
    }
}
```

---

# 6. DevOps & Deployment

## 6.1 Docker

```dockerfile
# Multi-stage build (production-ready)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline    # cache dependencies layer
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=build /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "-Xms256m", "-Xmx512m", "app.jar"]
```

```bash
# Build and run
docker build -t myapp:1.0 .
docker run -d -p 8080:8080 --name myapp \
  -e SPRING_PROFILES_ACTIVE=production \
  -e DB_URL=jdbc:postgresql://db:5432/mydb \
  myapp:1.0

# Common commands
docker logs myapp -f          # follow logs
docker exec -it myapp sh      # shell into container
docker stats                  # resource usage
docker image prune -f         # clean up images
```

---

## 6.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DB_URL=jdbc:postgresql://postgres:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

---

## 6.3 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'maven'

      - name: Run tests
        run: mvn test -Dspring.profiles.active=test
        env:
          DB_URL: jdbc:postgresql://localhost:5432/testdb

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: target/surefire-reports/

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: myorg/myapp:${{ github.sha }},myorg/myapp:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myorg/myapp:latest
            docker-compose down
            docker-compose up -d
            docker system prune -f
```

---

## 6.4 Nginx Configuration

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
events { worker_connections 1024; }

http {
    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    upstream app {
        least_conn;
        server app1:8080;
        server app2:8080;
        keepalive 32;
    }

    server {
        listen 80;
        server_name example.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com;

        ssl_certificate     /etc/nginx/certs/cert.pem;
        ssl_certificate_key /etc/nginx/certs/key.pem;
        ssl_protocols       TLSv1.2 TLSv1.3;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 5s;
            proxy_read_timeout 30s;
        }

        location /static/ {
            root /var/www;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 6.5 Environment Variables

```bash
# .env (never commit to git)
DB_PASSWORD=supersecret
JWT_SECRET=verylongsecretkey
SMTP_PASSWORD=mailpass

# .env.example (commit this — template)
DB_PASSWORD=your_db_password_here
JWT_SECRET=your_jwt_secret_here
SMTP_PASSWORD=your_smtp_password_here
```

```java
// application.yml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/appdb}
    username: ${DB_USER:appuser}
    password: ${DB_PASSWORD}     # required — no default

app:
  jwt:
    secret: ${JWT_SECRET}
    expiry: ${JWT_EXPIRY_MS:86400000}
  cors:
    origins: ${ALLOWED_ORIGINS:http://localhost:3000}
```

---

# 7. Testing & Software Quality

## 7.1 Testing Pyramid

```
                    /\
                   /  \
                  / E2E \          ← Few, slow, expensive
                 /________\
                /          \
               / Integration \     ← Some, medium speed
              /______________\
             /                \
            /    Unit Tests    \   ← Many, fast, cheap
           /____________________\
```

---

## 7.2 Unit Testing with JUnit 5

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock  private UserRepository userRepository;
    @Mock  private EmailService emailService;
    @InjectMocks private UserService userService;

    @Test
    @DisplayName("Should return user when found by ID")
    void findById_WhenExists_ReturnsUser() {
        // Arrange
        User mockUser = new User(1L, "Ahmed", "ahmed@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // Act
        UserResponse result = userService.findById(1L);

        // Assert
        assertThat(result.name()).isEqualTo("Ahmed");
        assertThat(result.email()).isEqualTo("ahmed@test.com");
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void findById_WhenNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(99L))
            .isInstanceOf(UserNotFoundException.class)
            .hasMessage("User not found: 99");
    }

    @Test
    @DisplayName("Should send email on registration")
    void register_ShouldSendWelcomeEmail() {
        CreateUserRequest req = new CreateUserRequest("Ahmed", "ahmed@test.com", "pass123");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        userService.register(req);

        verify(emailService).sendWelcome(eq("ahmed@test.com"), anyString());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "a", "ab"})
    void register_WithShortName_ShouldFail(String name) {
        assertThatThrownBy(() -> userService.register(new CreateUserRequest(name, "e@e.com", "pass")))
            .isInstanceOf(ValidationException.class);
    }
}
```

---

## 7.3 Integration Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Testcontainers
class UserControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired private TestRestTemplate restTemplate;
    @Autowired private UserRepository userRepository;

    @BeforeEach
    void setUp() { userRepository.deleteAll(); }

    @Test
    void createUser_ShouldPersistAndReturn201() {
        CreateUserRequest req = new CreateUserRequest("Ahmed", "ahmed@test.com", "pass1234");

        ResponseEntity<UserResponse> response = restTemplate.postForEntity(
            "/api/v1/users", req, UserResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().email()).isEqualTo("ahmed@test.com");
        assertThat(userRepository.count()).isEqualTo(1);
    }
}
```

---

## 7.4 TDD (Test-Driven Development)

```
RED   → Write a failing test
GREEN → Write minimum code to make it pass
REFACTOR → Improve code without changing behavior
(repeat)
```

```java
// Step 1: RED — write failing test
@Test
void calculateDiscount_ForPremiumUser_AppliesPercent() {
    User premium = User.premium("Ahmed");
    DiscountService service = new DiscountService();

    double price = service.calculate(100.0, premium);

    assertThat(price).isEqualTo(80.0); // 20% off
}

// Step 2: GREEN — minimal implementation
public class DiscountService {
    public double calculate(double price, User user) {
        if (user.isPremium()) return price * 0.8;
        return price;
    }
}

// Step 3: REFACTOR — improve
public class DiscountService {
    private static final Map<UserTier, Double> DISCOUNTS = Map.of(
        UserTier.PREMIUM, 0.20,
        UserTier.VIP, 0.35
    );

    public Money calculate(Money price, User user) {
        double discount = DISCOUNTS.getOrDefault(user.getTier(), 0.0);
        return price.multiply(1 - discount);
    }
}
```

---

## 7.5 Testing Best Practices

```
Test naming:      methodName_Condition_ExpectedBehavior
                  findById_WhenUserExists_ReturnsUser

Test structure:   Arrange → Act → Assert (AAA pattern)

One assertion:    Focus on one behavior per test

Isolated:         No shared state between tests
                  @BeforeEach to reset

Fast:             Unit tests < 1ms
                  Integration tests < 5s

Meaningful:       Tests serve as documentation
                  Test failure message should explain what broke

Coverage:         Aim for 80% line coverage on business logic
                  100% on critical paths (payment, auth)
                  Coverage alone doesn't guarantee quality
```


---

# 8. Advanced Database Engineering

## 8.1 Query Optimization

```sql
-- ❌ Slow: full table scan
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- ✅ Fast: range scan uses index
SELECT * FROM orders
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Slow: leading wildcard kills index
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- ✅ Fast: prefix search uses index
SELECT * FROM users WHERE email LIKE 'ahmed%';

-- ❌ N+1 Problem: 1 query for users + N queries for orders
List<User> users = userRepo.findAll();
for (User u : users) {
    List<Order> orders = orderRepo.findByUserId(u.getId()); // N queries!
}

-- ✅ Fix: JOIN fetches everything in one query
SELECT u.*, o.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true;
```

---

## 8.2 Indexes — Deep Dive

```sql
-- B-Tree Index (default) — good for =, <, >, BETWEEN, LIKE prefix
CREATE INDEX idx_email ON users(email);

-- Composite Index — column order matters!
-- Covers queries on (status), (status, created_at), but NOT (created_at) alone
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Partial Index — index only a subset of rows
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Covering Index — query satisfied entirely from index (no table lookup)
CREATE INDEX idx_orders_covering ON orders(user_id, status, total);
-- This query uses only the index:
SELECT status, total FROM orders WHERE user_id = 42;

-- Check index usage with EXPLAIN
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42 AND status = 'PENDING';
-- Look for: Index Scan vs Seq Scan
-- Check: actual time, rows, cost
```

**Index anti-patterns:**
```
Too many indexes → slows INSERT/UPDATE/DELETE
Index on low-cardinality column → rarely selective enough (boolean, status with 2 values)
Unused indexes → waste space, slow writes
Missing index on FK → JOIN scans entire table
```

---

## 8.3 Transaction Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|-------|-----------|---------------------|-------------|------------|
| READ UNCOMMITTED | ✅ possible | ✅ possible | ✅ possible | Fastest |
| READ COMMITTED | ❌ prevented | ✅ possible | ✅ possible | Good (default PG) |
| REPEATABLE READ | ❌ | ❌ prevented | ✅ possible | Moderate |
| SERIALIZABLE | ❌ | ❌ | ❌ prevented | Slowest |

```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Pessimistic locking — lock row for update
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE; -- other transactions wait
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Optimistic locking — check version, no lock
UPDATE accounts
SET balance = balance - 100, version = version + 1
WHERE id = 1 AND version = 5; -- fails if version changed
-- If 0 rows affected → conflict → retry
```

---

## 8.4 Deadlocks

```sql
-- Deadlock scenario:
-- Transaction A: locks row 1, waits for row 2
-- Transaction B: locks row 2, waits for row 1 → DEADLOCK

-- Prevention: always acquire locks in same order
-- Detection: DB detects and kills one transaction

-- Retry logic in Java
@Retryable(value = DeadlockLoserDataAccessException.class, maxAttempts = 3,
           backoff = @Backoff(delay = 100, multiplier = 2))
@Transactional
public void transferFunds(Long fromId, Long toId, BigDecimal amount) {
    // Always lock in same order to prevent deadlocks
    Long firstId = Math.min(fromId, toId);
    Long secondId = Math.max(fromId, toId);
    Account first  = accountRepo.findByIdForUpdate(firstId);
    Account second = accountRepo.findByIdForUpdate(secondId);
    // proceed with transfer
}
```

---

## 8.5 Connection Pooling

```yaml
# HikariCP (Spring Boot default)
spring:
  datasource:
    hikari:
      maximum-pool-size: 20          # max connections
      minimum-idle: 5                # keep 5 idle connections
      connection-timeout: 30000      # wait max 30s for connection
      idle-timeout: 600000           # close idle after 10min
      max-lifetime: 1800000          # recycle after 30min
      leak-detection-threshold: 60000 # warn if held > 60s
```

**Pool size formula:** `pool_size = (core_count * 2) + effective_spindle_count`
- For a 4-core machine with SSD: `(4 * 2) + 1 = 9` — a pool of 10-20 is usually sufficient

---

## 8.6 Sharding & Partitioning

```sql
-- Table Partitioning (single DB, multiple storage)
-- Partition by range (date-based)
CREATE TABLE orders (
    id          BIGINT,
    created_at  TIMESTAMP,
    user_id     BIGINT,
    total       DECIMAL(10,2)
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE orders_2025 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
-- Queries with WHERE created_at IN year only scan relevant partition

-- Partition by hash (even distribution)
CREATE TABLE users (id BIGINT, ...) PARTITION BY HASH (id);
CREATE TABLE users_0 PARTITION OF users FOR VALUES WITH (modulus 4, remainder 0);
CREATE TABLE users_1 PARTITION OF users FOR VALUES WITH (modulus 4, remainder 1);
```

---

## 8.7 Redis Advanced Patterns

```java
// Distributed Lock
public boolean acquireLock(String resource, String lockId, Duration ttl) {
    Boolean acquired = redis.opsForValue().setIfAbsent(
        "lock:" + resource, lockId, ttl);
    return Boolean.TRUE.equals(acquired);
}

public void releaseLock(String resource, String lockId) {
    String current = (String) redis.opsForValue().get("lock:" + resource);
    if (lockId.equals(current)) redis.delete("lock:" + resource);
}

// Leaderboard with Sorted Sets
redis.opsForZSet().add("leaderboard", "player1", 1500.0);
redis.opsForZSet().add("leaderboard", "player2", 1800.0);
Set<ZSetOperations.TypedTuple<Object>> top10 =
    redis.opsForZSet().reverseRangeWithScores("leaderboard", 0, 9);

// Pub/Sub for real-time notifications
redis.convertAndSend("notifications:" + userId, message);

// Rate limiting with sliding window
public boolean isAllowed(String key, int maxRequests, Duration window) {
    long now = System.currentTimeMillis();
    long windowStart = now - window.toMillis();

    redis.opsForZSet().removeRangeByScore(key, 0, windowStart);
    Long count = redis.opsForZSet().zCard(key);

    if (count < maxRequests) {
        redis.opsForZSet().add(key, String.valueOf(now), now);
        redis.expire(key, window);
        return true;
    }
    return false;
}
```

---

## 8.8 SQL Injection Prevention

```java
// ❌ NEVER do this — vulnerable to SQL injection
String query = "SELECT * FROM users WHERE email = '" + email + "'";
// Attacker inputs: ' OR '1'='1 → returns all users
// Attacker inputs: '; DROP TABLE users; -- → destroys table

// ✅ Always use parameterized queries
// JPA
Optional<User> findByEmail(String email); // Spring Data handles this safely

// JPQL
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

// Native SQL with named parameters
@Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
Optional<User> findByEmailNative(@Param("email") String email);

// JDBC
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?");
stmt.setString(1, email); // parameterized — safe
```

---

## 8.9 N+1 Problem

```java
// ❌ N+1 — 1 query for users + N queries for each user's orders
@Entity
public class User {
    @OneToMany(fetch = FetchType.LAZY) // lazy = query on access
    private List<Order> orders;
}

List<User> users = userRepo.findAll(); // 1 query
for (User u : users) {
    System.out.println(u.getOrders().size()); // N queries!
}

// ✅ Fix 1: Eager JOIN FETCH
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveUsersWithOrders();

// ✅ Fix 2: @EntityGraph
@EntityGraph(attributePaths = {"orders", "orders.items"})
List<User> findAll();

// ✅ Fix 3: Batch Size
@OneToMany(fetch = FetchType.LAZY)
@BatchSize(size = 20) // loads 20 users' orders in one query
private List<Order> orders;
```

---

# 9. Git & Team Collaboration

## 9.1 Git Workflows

### Feature Branch Workflow
```
main ──────────────────────────────────────────►
       │                           ↑
       └─── feature/user-login ────┘ (merge via PR)
```

### Git Flow
```
main ◄───────────────────── (releases only)
develop ◄──────────────────── (integration branch)
    feature/* ──► develop
    release/* ──► main + develop
    hotfix/*  ──► main + develop
```

### Trunk-Based Development (modern, CI/CD-friendly)
```
main ◄── (all commits, frequently)
         feature flags control what's visible
         short-lived branches < 1 day
```

---

## 9.2 Semantic Commits

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Refactoring, no feature/fix |
| `test` | Adding tests |
| `chore` | Build, dependencies, CI |
| `perf` | Performance improvement |
| `revert` | Revert previous commit |

```bash
# Good commit messages
feat(auth): add JWT refresh token rotation
fix(orders): prevent duplicate order submission on network retry
refactor(user): extract email validation to dedicated service
test(payment): add integration tests for refund flow

# Bad commit messages
fix bug
update code
changes
WIP
```

---

## 9.3 Key Git Commands

```bash
# Branching
git checkout -b feature/new-login    # create and switch
git branch -d feature/new-login      # delete local branch
git push origin --delete feature/x   # delete remote branch

# Rebase (clean history)
git checkout feature/my-feature
git rebase main                       # replay commits on top of main
# fix conflicts if any, then:
git rebase --continue
git push --force-with-lease           # force push (safely)

# Interactive rebase (squash commits)
git rebase -i HEAD~3                  # last 3 commits
# pick = keep, squash = combine, reword = change message, drop = delete

# Stash
git stash save "WIP: login page"      # save work in progress
git stash list
git stash pop                          # restore latest stash

# Cherry-pick
git cherry-pick abc1234               # apply specific commit to current branch

# Undo
git restore file.java                 # discard local changes
git reset HEAD~1                      # undo last commit (keep changes staged)
git reset --hard HEAD~1               # undo last commit (discard changes)
git revert abc1234                    # create new commit that undoes abc1234

# Useful inspection
git log --oneline --graph --all       # visual branch history
git diff main...feature/my-branch     # changes since branch off main
git blame src/User.java               # who changed each line
```

---

## 9.4 Code Review Best Practices

**As author:**
```
✅ Keep PRs small — under 400 lines changed
✅ Write clear PR description: What, Why, How
✅ Add screenshots for UI changes
✅ Self-review before requesting review
✅ Link to issue/ticket
✅ Mark work-in-progress as Draft PR
```

**As reviewer:**
```
✅ Review logic, not style (let linters handle style)
✅ Ask questions instead of demanding changes ("What if...?")
✅ Approve with non-blocking nits ("nit: could rename this but LGTM")
✅ Comment on the code, not the person
✅ Acknowledge good work
✅ Respond within 24 hours

Review checklist:
□ Does it solve the right problem?
□ Are edge cases handled?
□ Is error handling correct?
□ Are there tests?
□ Any performance concerns?
□ Security implications?
□ Is it readable and maintainable?
```

---

# 10. Security Fundamentals

## 10.1 Authentication vs Authorization

```
Authentication (AuthN): Who are you? → prove identity (login, JWT, OAuth)
Authorization  (AuthZ): What can you do? → check permissions (RBAC, ACL)

Flow:
Request → AuthN (JWT valid?) → AuthZ (has permission?) → Resource
```

---

## 10.2 Password Hashing

```java
// ❌ NEVER store plain text or MD5/SHA1 passwords
String bad = md5(password); // crackable with rainbow tables

// ✅ Use bcrypt (adaptive — cost factor increases with hardware)
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // cost factor 12
}

// Registration
String hash = passwordEncoder.encode(rawPassword);
user.setPasswordHash(hash);

// Login verification
boolean valid = passwordEncoder.matches(rawPassword, storedHash);
```

---

## 10.3 Common Vulnerabilities (OWASP Top 10)

### SQL Injection — see Section 8.8

### XSS (Cross-Site Scripting)
```java
// ❌ Vulnerable — rendering user input as HTML
model.addAttribute("username", request.getParameter("name"));
// Template: <p>Welcome ${username}!</p>
// Attack: <script>steal(document.cookie)</script>

// ✅ Fix — escape output (Thymeleaf does this by default with th:text)
// <p th:text="${username}">Welcome!</p>   ← safe, auto-escaped
// <p th:utext="${username}">Welcome!</p>  ← UNSAFE — explicit unescaped

// Content Security Policy header
response.setHeader("Content-Security-Policy",
    "default-src 'self'; script-src 'self'; img-src 'self' data:");
```

### CSRF (Cross-Site Request Forgery)
```java
// ❌ Vulnerable: attacker's site submits form to your API using victim's cookies

// ✅ Fix 1: CSRF token (Spring Security)
http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
// Client must include X-XSRF-TOKEN header

// ✅ Fix 2: SameSite cookies
response.addHeader("Set-Cookie",
    "sessionid=abc; SameSite=Strict; Secure; HttpOnly");

// ✅ Fix 3: If using JWT in Authorization header (not cookies) → CSRF not applicable
```

### Security Headers
```java
http
    .headers(headers -> headers
        .frameOptions().deny()                      // X-Frame-Options: DENY
        .contentTypeOptions().and()                 // X-Content-Type-Options: nosniff
        .httpStrictTransportSecurity(hsts -> hsts   // HSTS
            .maxAgeInSeconds(31536000)
            .includeSubDomains(true))
    );
```

---

## 10.4 HTTPS & TLS

```nginx
# Force HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}

# TLS configuration
server {
    listen 443 ssl;
    ssl_certificate     /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # Only TLS 1.2 and 1.3
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
}
```

---

## 10.5 Input Validation

```java
// Bean Validation
public record CreateUserRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    String name,

    @Email(message = "Invalid email format")
    @NotBlank
    String email,

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$]).{8,}$",
             message = "Password must have uppercase, number, and special char")
    String password,

    @Min(0) @Max(150)
    Integer age
) {}

// Controller
@PostMapping("/users")
public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
    // @Valid triggers validation — throws MethodArgumentNotValidException on failure
    return ResponseEntity.status(201).body(userService.create(req));
}
```

---

# 11. Design Patterns

## 11.1 Creational Patterns

### Singleton
```java
// Thread-safe lazy singleton
public class AppConfig {
    private static volatile AppConfig instance;
    private final Map<String, String> config;

    private AppConfig() {
        config = loadFromFile("application.properties");
    }

    public static AppConfig getInstance() {
        if (instance == null) {
            synchronized (AppConfig.class) {
                if (instance == null) instance = new AppConfig();
            }
        }
        return instance;
    }
}
```

### Factory Method
```java
interface PaymentProcessor { void process(Payment payment); }

class StripeProcessor implements PaymentProcessor {
    public void process(Payment p) { System.out.println("Stripe: " + p.amount()); }
}
class PayPalProcessor implements PaymentProcessor {
    public void process(Payment p) { System.out.println("PayPal: " + p.amount()); }
}

class PaymentFactory {
    public static PaymentProcessor create(String provider) {
        return switch (provider.toLowerCase()) {
            case "stripe" -> new StripeProcessor();
            case "paypal" -> new PayPalProcessor();
            default -> throw new IllegalArgumentException("Unknown provider: " + provider);
        };
    }
}
```

### Builder
```java
public class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final Duration timeout;

    private HttpRequest(Builder b) {
        this.url = b.url; this.method = b.method;
        this.headers = Map.copyOf(b.headers);
        this.body = b.body; this.timeout = b.timeout;
    }

    public static class Builder {
        private final String url;
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private Duration timeout = Duration.ofSeconds(30);

        public Builder(String url) { this.url = url; }
        public Builder method(String m) { this.method = m; return this; }
        public Builder header(String k, String v) { headers.put(k,v); return this; }
        public Builder body(String b) { this.body = b; return this; }
        public Builder timeout(Duration t) { this.timeout = t; return this; }
        public HttpRequest build() { return new HttpRequest(this); }
    }
}
```

---

## 11.2 Structural Patterns

### Adapter
```java
// Third-party SMS library with different interface
class TwilioSMS {
    public void sendTextMessage(String to, String from, String text) { }
}

// Our interface
interface MessageSender {
    void send(String recipient, String content);
}

// Adapter
class TwilioAdapter implements MessageSender {
    private final TwilioSMS twilio = new TwilioSMS();
    private final String senderNumber;

    public TwilioAdapter(String senderNumber) { this.senderNumber = senderNumber; }

    public void send(String recipient, String content) {
        twilio.sendTextMessage(recipient, senderNumber, content); // translate call
    }
}
```

### Decorator
```java
interface DataSource { void writeData(String data); String readData(); }

class FileDataSource implements DataSource {
    public void writeData(String data) { /* write to file */ }
    public String readData() { return /* file content */ ""; }
}

class EncryptionDecorator implements DataSource {
    private final DataSource wrapped;
    public EncryptionDecorator(DataSource ds) { this.wrapped = ds; }
    public void writeData(String data) { wrapped.writeData(encrypt(data)); }
    public String readData() { return decrypt(wrapped.readData()); }
    private String encrypt(String s) { return "ENC[" + s + "]"; }
    private String decrypt(String s) { return s.replace("ENC[","").replace("]",""); }
}

class CompressionDecorator implements DataSource {
    private final DataSource wrapped;
    public CompressionDecorator(DataSource ds) { this.wrapped = ds; }
    public void writeData(String data) { wrapped.writeData(compress(data)); }
    public String readData() { return decompress(wrapped.readData()); }
}

// Stack decorators
DataSource ds = new CompressionDecorator(new EncryptionDecorator(new FileDataSource()));
```

---

## 11.3 Behavioral Patterns

### Observer (Event System)
```java
interface EventListener<T> { void onEvent(T event); }

class EventBus {
    private final Map<Class<?>, List<EventListener<?>>> listeners = new HashMap<>();

    public <T> void subscribe(Class<T> eventType, EventListener<T> listener) {
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }

    @SuppressWarnings("unchecked")
    public <T> void publish(T event) {
        List<EventListener<?>> eventListeners = listeners.getOrDefault(event.getClass(), List.of());
        eventListeners.forEach(l -> ((EventListener<T>) l).onEvent(event));
    }
}
```

### Strategy
```java
interface PricingStrategy { BigDecimal calculate(BigDecimal basePrice, Customer customer); }

class RegularPricing implements PricingStrategy {
    public BigDecimal calculate(BigDecimal price, Customer c) { return price; }
}
class PremiumPricing implements PricingStrategy {
    public BigDecimal calculate(BigDecimal price, Customer c) {
        return price.multiply(BigDecimal.valueOf(0.85)); // 15% off
    }
}
class SeasonalPricing implements PricingStrategy {
    private final BigDecimal discount;
    public SeasonalPricing(BigDecimal discount) { this.discount = discount; }
    public BigDecimal calculate(BigDecimal price, Customer c) {
        return price.multiply(BigDecimal.ONE.subtract(discount));
    }
}

class PricingService {
    private PricingStrategy strategy;
    public void setStrategy(PricingStrategy s) { this.strategy = s; }
    public BigDecimal getPrice(BigDecimal base, Customer c) {
        return strategy.calculate(base, c);
    }
}
```

### Template Method
```java
abstract class DataExporter {
    // Template method — defines the algorithm skeleton
    public final String export(List<?> data) {
        String formatted = formatData(data);   // abstract
        String validated = validate(formatted); // hook
        return writeOutput(validated);           // abstract
    }

    protected abstract String formatData(List<?> data);
    protected abstract String writeOutput(String data);

    protected String validate(String data) { return data; } // default: no-op
}

class CsvExporter extends DataExporter {
    protected String formatData(List<?> data) {
        return data.stream().map(Object::toString).collect(Collectors.joining(","));
    }
    protected String writeOutput(String data) { return data + "\n"; }
}
```

---

## 11.4 Pattern Quick Reference

| Pattern | Category | One-liner |
|---------|----------|-----------|
| Singleton | Creational | One instance globally |
| Factory | Creational | Encapsulate object creation |
| Builder | Creational | Construct complex objects step-by-step |
| Prototype | Creational | Clone instead of construct |
| Adapter | Structural | Bridge incompatible interfaces |
| Decorator | Structural | Add behavior without modifying |
| Facade | Structural | Simple interface to complex subsystem |
| Proxy | Structural | Control access to object |
| Observer | Behavioral | Notify multiple dependents |
| Strategy | Behavioral | Swap algorithms at runtime |
| Template Method | Behavioral | Define skeleton, subclasses fill steps |
| Command | Behavioral | Encapsulate request as object |
| Chain of Responsibility | Behavioral | Pass request along handler chain |

---

# 12. SOLID Principles

## S — Single Responsibility
```java
// ❌ Bad
class UserManager {
    public void createUser(User u) { }
    public void sendWelcomeEmail(User u) { } // not UserManager's job
    public void exportToCsv() { }            // not UserManager's job
}

// ✅ Good
class UserService        { public User create(CreateUserRequest req) { } }
class EmailService       { public void sendWelcome(User u) { } }
class UserReportExporter { public String exportCsv() { } }
```

## O — Open/Closed
```java
// ❌ Bad — add new format → edit this method
class ReportGenerator {
    public String generate(String format, List<Order> orders) {
        if (format.equals("csv")) { return generateCsv(orders); }
        else if (format.equals("pdf")) { return generatePdf(orders); } // keep adding ifs
        return "";
    }
}

// ✅ Good — add new format → create new class
interface ReportFormat { String generate(List<Order> orders); }
class CsvReport implements ReportFormat { public String generate(List<Order> o) { } }
class PdfReport implements ReportFormat { public String generate(List<Order> o) { } }
class JsonReport implements ReportFormat { public String generate(List<Order> o) { } }

class ReportService {
    public String generate(ReportFormat format, List<Order> orders) {
        return format.generate(orders); // no change needed for new formats
    }
}
```

## L — Liskov Substitution
```java
// ❌ Bad — Square breaks Rectangle's contract
class Rectangle { void setWidth(int w); void setHeight(int h); }
class Square extends Rectangle {
    void setWidth(int w) { this.width = this.height = w; } // breaks expectation!
}

// ✅ Good — separate hierarchy
interface Shape { int area(); }
class Rectangle implements Shape { /* own impl */ }
class Square    implements Shape { /* own impl */ }
```

## I — Interface Segregation
```java
// ❌ Bad — fat interface
interface Machine { void print(); void scan(); void fax(); void staple(); }
class SimplePrinter implements Machine {
    public void print() { }
    public void scan()   { throw new UnsupportedOperationException(); } // forced!
    public void fax()    { throw new UnsupportedOperationException(); } // forced!
    public void staple() { throw new UnsupportedOperationException(); } // forced!
}

// ✅ Good — segregated interfaces
interface Printable { void print(); }
interface Scannable { void scan(); }
interface Faxable   { void fax(); }

class SimplePrinter implements Printable { public void print() { } }
class AllInOnePrinter implements Printable, Scannable, Faxable { /* all 3 */ }
```

## D — Dependency Inversion
```java
// ❌ Bad — hardcoded dependency
class NotificationService {
    private SmtpEmailSender emailSender = new SmtpEmailSender(); // concrete!
    public void notify(String msg) { emailSender.send(msg); }
}

// ✅ Good — depend on abstraction, inject implementation
interface MessageSender { void send(String message); }

@Service
class NotificationService {
    private final MessageSender sender;

    public NotificationService(MessageSender sender) { this.sender = sender; }
    public void notify(String msg) { sender.send(msg); }
}

// Inject different implementations via DI container
@Bean public MessageSender messageSender() { return new SmtpEmailSender(); }
// Swap to: return new SlackMessageSender(); // zero code change in NotificationService
```

---

# 13. AI-Assisted Development

## 13.1 Prompting for Code Generation

**Structure of an effective coding prompt:**
```
1. Context     → What system/technology stack are you using?
2. Task        → What exactly do you want built?
3. Constraints → Any requirements, patterns, or limitations?
4. Examples    → Input/output examples if helpful
5. Format      → What format do you want the response in?
```

**Good prompt examples:**
```
❌ Bad:  "Write a user login function"

✅ Good: "I'm building a Spring Boot 3.x REST API with JWT authentication.
         Write a POST /auth/login endpoint that:
         - Accepts { email, password } in the request body
         - Validates credentials against a PostgreSQL users table using BCrypt
         - Returns a JWT token with 24h expiry on success
         - Returns 401 with error message on failure
         - Follows our error response format: { status, error, message }
         Use our existing UserRepository and JwtUtil classes."
```

---

## 13.2 Prompting for Debugging

```
Template:
"I have a bug in [language/framework]. Here is the code: [paste code]

Expected behavior: [what should happen]
Actual behavior:   [what actually happens]
Error message:     [paste full stack trace if any]

What I've tried:   [what you already attempted]"
```

```
Example:
"I have a Spring Boot service getting a LazyInitializationException.

Error: could not initialize proxy - no Session
Stack trace: [paste]

This happens when I call user.getOrders() in my REST controller.
I've tried adding @Transactional but it still fails.
Here's my entity: [paste]
Here's my controller: [paste]"
```

---

## 13.3 Prompting for Architecture

```
Template:
"I need to design [system/feature]. Help me think through the architecture.

Requirements:
- [functional requirement 1]
- [functional requirement 2]
- Non-functional: [scale, latency, consistency needs]

Current tech stack: [list]
Team size: [n developers]

I'm thinking of using [your initial approach]. What are the trade-offs?
Are there better alternatives?"
```

---

## 13.4 Prompting for Refactoring

```
"Refactor this [Java/Python/etc.] code to:
- Follow [SOLID / Clean Architecture / specific pattern]
- Improve [readability / testability / performance]
- [specific issue to fix]

Here's the original code: [paste]

Keep the same external behavior. Explain the changes you made and why."
```

---

## 13.5 AI Validation Workflow

```
AI generates code
      │
      ▼
□ Does it compile?
□ Does it make logical sense?
□ Are edge cases handled?
□ Is error handling present?
□ Any security concerns? (SQL injection, XSS, etc.)
□ Does it match our architectural patterns?
□ Is it testable?
      │
      ▼
Write tests to verify AI-generated logic
      │
      ▼
Review for over-engineering or unnecessary complexity
      │
      ▼
Code review by human before merge
```

**Human review checklist for AI code:**
```
□ Check all external inputs are validated
□ Verify no hardcoded secrets or credentials
□ Confirm error handling is correct (not swallowed)
□ Ensure logging is appropriate (no sensitive data logged)
□ Test the happy path AND edge cases
□ Verify performance: no N+1, no missing indexes
□ Check for thread safety if shared state involved
```

---

## 13.6 AI Limitations to Know

```
✅ AI is good at:
- Boilerplate and scaffolding
- Known patterns and standard implementations
- Explaining concepts and trade-offs
- Generating tests for given code
- Regex, SQL queries, configuration files
- Refactoring well-described problems

⚠️ AI struggles with:
- Deep understanding of your specific domain logic
- Keeping consistency across a large codebase
- Long-term architectural decisions
- Novel or cutting-edge approaches
- Your company-specific conventions (unless provided as context)
- Security nuances — always review security-critical code

❌ Never blindly trust AI-generated:
- Authentication/authorization logic
- Payment processing code
- Cryptography implementations
- Data migration scripts
- Infrastructure-as-code for production
```

---

# 14. Interview Quick Revision

## OOP
```
4 pillars:    Encapsulation, Inheritance, Polymorphism, Abstraction
Encapsulation = private fields + public interface
Polymorphism  = same method, different behavior based on object type
Abstraction   = hide complexity, expose only what's needed
Prefer:       Composition over Inheritance
```

## DSA
```
Array         O(1) access, O(n) insert
LinkedList    O(1) head insert, O(n) access
Stack/Queue   O(1) push/pop/enqueue/dequeue
HashMap       O(1) average get/put
Binary Search O(log n) — sorted array required
BFS           shortest path, level order
DFS           cycle detection, path exists
DP            optimal substructure + overlapping subproblems
Sliding Window fixed/variable window on array/string
Two Pointers  sorted arrays, paired comparisons
```

## Design Patterns
```
Singleton  = one global instance
Factory    = create without specifying class
Builder    = step-by-step construction
Adapter    = bridge incompatible interfaces
Observer   = subscribe/notify
Strategy   = swappable algorithms
```

## SOLID
```
S = one reason to change
O = extend, don't modify
L = subtypes substitutable
I = small interfaces, no forced methods
D = depend on abstractions, inject
```

## System Design
```
LB         = distribute traffic, eliminate single point of failure
Cache      = Redis, reduce DB load, set TTL
CDN        = static assets close to users
DB scale   = read replicas, sharding, partitioning
Queue      = decouple, absorb spikes (Kafka, RabbitMQ)
CAP        = can't have all 3: pick CP or AP
Circuit    = fail fast, prevent cascade failure
Breaker
```

## Database
```
ACID       = Atomicity, Consistency, Isolation, Durability
Index      = speeds reads, slows writes, B-tree default
N+1        = fix with JOIN FETCH or @EntityGraph
Isolation  = READ COMMITTED is safe default
Sharding   = split data across DBs by key
Replication = read replicas for read scaling
```

---

# 15. Production Readiness Checklist

## Application
```
□ All configuration via environment variables, no hardcoded values
□ Graceful shutdown — finish in-flight requests before stopping
□ Health check endpoint (/actuator/health)
□ Request logging with correlation IDs
□ Structured logging (JSON format for log aggregation)
□ Meaningful error messages to clients, full detail in server logs
□ Input validation on all endpoints
□ Rate limiting enabled
□ Pagination on list endpoints (no unbounded queries)
□ Timeouts on all external calls (HTTP clients, DB)
```

## Security
```
□ HTTPS enforced, HTTP redirects to HTTPS
□ Security headers present (HSTS, CSP, X-Frame-Options)
□ JWT expiry is reasonable (hours not days)
□ Passwords hashed with bcrypt (cost factor ≥ 10)
□ SQL injection prevention — parameterized queries everywhere
□ No sensitive data in logs (no passwords, tokens, PII)
□ Dependencies scanned for vulnerabilities (OWASP Dependency Check)
□ API endpoints require authentication (no accidental public endpoints)
```

## Database
```
□ Database credentials in secrets manager, not env files
□ Connection pool sized appropriately
□ Indexes on all FK columns and frequently queried columns
□ DB migrations in version control (Flyway/Liquibase)
□ DB backups automated and tested
□ No raw SQL with string concatenation
```

## Infrastructure
```
□ Multi-instance deployment (no single point of failure)
□ Auto-scaling configured
□ Load balancer health checks configured
□ Deployment can be rolled back in < 5 minutes
□ Blue-green or canary deployment strategy
□ Resource limits set on containers (CPU/memory)
□ Persistent data stored outside containers (volumes)
```

## Observability
```
□ Metrics dashboard (response times, error rates, throughput)
□ Alerting on: error rate > 1%, P99 latency > 1s, disk usage > 80%
□ Centralized log aggregation (ELK, Grafana Loki)
□ Distributed tracing for microservices (Jaeger, Zipkin)
□ Uptime monitoring (external ping every minute)
□ On-call runbook for common incidents
```

---

# 16. Backend Engineering Roadmap

```
FUNDAMENTALS (Months 1-3)
├── Java/Python basics + OOP
├── Data Structures & Algorithms
├── SQL + database design
├── HTTP + REST basics
└── Git basics

CORE BACKEND (Months 4-8)
├── Spring Boot or similar framework
├── REST API design + best practices
├── Authentication (JWT, OAuth)
├── Database (JPA, query optimization)
├── Testing (JUnit, Mockito, integration tests)
└── Docker basics

INTERMEDIATE (Months 9-14)
├── System design fundamentals
├── Caching (Redis)
├── Message queues (Kafka/RabbitMQ)
├── Microservices concepts
├── CI/CD (GitHub Actions)
└── Clean Architecture + SOLID

ADVANCED (Months 15-24)
├── Distributed systems
├── Performance optimization
├── Security (OWASP, penetration basics)
├── Observability (metrics, tracing, logging)
├── Cloud (AWS/GCP/Azure basics)
└── Leadership: code review, mentoring, design docs

SENIOR+ (Ongoing)
├── Architecture decision records (ADRs)
├── System design at scale (millions of users)
├── Cross-team technical leadership
├── Engineering culture & best practices
└── Domain-Driven Design
```

---

# 17. Common Engineering Mistakes

## Code Level
```
❌ Swallowing exceptions: catch(Exception e) { }
❌ Returning null instead of Optional or throwing
❌ Not closing resources (streams, connections)
❌ Mutable shared state in multi-threaded code
❌ Magic numbers: if (status == 3) vs if (status == Status.ACTIVE)
❌ Comments explaining WHAT instead of WHY
❌ Premature optimization before profiling
❌ God class with 50 methods and 2000 lines
❌ Boolean parameters: process(true, false, true) — use named params/objects
```

## Database
```
❌ Missing indexes on JOIN and WHERE columns
❌ SELECT * in production queries
❌ Unbounded queries without LIMIT
❌ DB logic in loops (N+1)
❌ Not using transactions for multi-step writes
❌ Storing sensitive data unencrypted
❌ Skipping migrations — altering DB manually
```

## Architecture
```
❌ Distributed monolith — microservices that must deploy together
❌ Shared database between services
❌ Synchronous calls between all services (everything is tightly coupled)
❌ No circuit breakers on external calls
❌ Caching without understanding invalidation
❌ Ignoring idempotency (duplicate requests cause duplicate data)
❌ No graceful degradation when dependencies fail
```

## Process
```
❌ Huge PRs (1000+ lines) that are impossible to review
❌ No tests for business-critical flows
❌ Deploying Friday afternoon
❌ No rollback plan before deployment
❌ Ignoring logs and metrics until outage
❌ "Works on my machine" — no reproducible environments
```

---

# 18. Senior Engineer Notes

## Architecture Principles
```
Keep it simple (KISS): The most maintainable code is code that doesn't exist.
                        Add complexity only when you need it, not when you can.

YAGNI:  "You Aren't Gonna Need It" — don't build for imaginary future requirements.
        Build for today's requirements, refactor when requirements change.

DRY:    "Don't Repeat Yourself" — but don't abstract prematurely.
        Duplication is better than the wrong abstraction.

Boring tech: Proven boring technology > exciting new technology in production.
             New tech has unknown failure modes.

Fail fast: Surface errors immediately, don't hide them.
           A system that fails obviously is easier to debug than one that silently corrupts.
```

## Decision Making
```
Trade-offs always exist:
  Consistency vs Availability
  Performance vs Readability
  Flexibility vs Simplicity
  Build vs Buy

Document decisions (ADR format):
  Context:   What is the situation?
  Decision:  What did you decide?
  Reasoning: Why? What alternatives did you consider?
  Consequences: What are the trade-offs?

When you're unsure:
  Start simple, measure, then optimize.
  You can always add complexity; removing it is much harder.
```

## Team Engineering
```
Code review goals:
  1. Knowledge sharing (primary)
  2. Catch bugs (secondary)
  3. Style enforcement (let tools do this)

Writing good documentation:
  WHY over WHAT — code shows what, comments explain why
  README: how to run, how to test, key architectural decisions
  Keep docs close to code (in repo, not wiki)

Technical debt:
  Some debt is intentional (startup speed) — track it, pay it down
  Some debt is accidental (bad decisions) — refactor proactively
  Never take on debt without acknowledging it

Estimation:
  Double your estimate, then double again
  Communicate uncertainty explicitly: "3-5 days if no surprises"
  Break work into small pieces for better estimates
```

## Performance Mindset
```
Measure first:
  Never optimize without a profiler
  Know your bottleneck before writing a single optimization

Common bottlenecks in order of frequency:
  1. Database queries (N+1, missing indexes, bad schema)
  2. External HTTP calls (no timeouts, no caching)
  3. Memory (GC pressure, object allocation)
  4. CPU (algorithms, serialization)
  5. Network (payload size, round trips)

Performance targets:
  API p99 < 200ms for user-facing endpoints
  Batch jobs: optimize for throughput, not latency
  DB queries: > 100ms is worth investigating
```

---

## Master Cheatsheet

### Big O
```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

### Algorithm Patterns
```
Sorted array + search/pair  → Binary Search or Two Pointers
Subarray/substring problem  → Sliding Window
Graph traversal             → BFS (shortest path) or DFS (explore/backtrack)
Optimize recursive          → Memoization / Dynamic Programming
Best per step               → Greedy
All combinations/paths      → Backtracking
Priority / Top K            → Heap / Priority Queue
Prefix search               → Trie
```

### System Design Triggers
```
"Millions of users"         → Horizontal scaling + Load Balancer
"Fast reads"                → Cache (Redis) + CDN
"Decouple services"         → Message Queue (Kafka)
"Real-time updates"         → WebSockets
"Search feature"            → Elasticsearch
"Big data analytics"        → Data warehouse (separate from OLTP)
"Idempotency needed"        → Idempotency keys, deduplication
"Eventual consistency OK"   → NoSQL (Cassandra/DynamoDB)
"Strong consistency needed" → SQL with transactions
```

### HTTP Quick Reference
```
200 OK | 201 Created | 204 No Content
400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found
409 Conflict | 422 Unprocessable | 429 Too Many Requests
500 Internal Error | 503 Unavailable
```

### SQL Quick Reference
```sql
SELECT col FROM tbl WHERE cond ORDER BY col LIMIT n;
INSERT INTO tbl (col1, col2) VALUES (v1, v2);
UPDATE tbl SET col = val WHERE cond;
DELETE FROM tbl WHERE cond;
JOIN: INNER (match), LEFT (all left), RIGHT (all right), FULL (all both)
GROUP BY + HAVING (filter after grouping)
EXPLAIN ANALYZE → check index usage
```
