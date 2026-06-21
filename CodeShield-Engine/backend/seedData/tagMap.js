/**
 * Tag enrichment for the CodeShield problem bank.
 *
 * Structure:
 *   CATEGORY_DEFAULT_TAGS: fallback tags applied to every problem in a category
 *   TITLE_OVERRIDE_TAGS:   specific tags keyed by exact problem title (merged on top
 *                          of the category defaults so problems can have extra tags)
 *
 * Tags use a consistent vocabulary:
 *   Arrays, Strings, Math, Stacks, Queues, Linked Lists, Trees, Graphs,
 *   Dynamic Programming, Heaps, Sorting, Binary Search, Two Pointers,
 *   Sliding Window, Bit Manipulation, Backtracking, Greedy, Recursion,
 *   Hash Map, Divide & Conquer, BFS, DFS, Topological Sort
 */

const CATEGORY_DEFAULT_TAGS = {
    'Arrays':             ['Arrays'],
    'Strings':            ['Strings'],
    'Math':               ['Math'],
    'Stacks':             ['Stacks'],
    'Queues':             ['Queues'],
    'Linked Lists':       ['Linked Lists'],
    'Trees':              ['Trees'],
    'Graphs':             ['Graphs'],
    'Dynamic Programming':['Dynamic Programming'],
    'Heaps':              ['Heaps'],
    'Backtracking':       ['Backtracking', 'Recursion'],
    'General':            [],
};

/**
 * Title-keyed override map.  Tags here are MERGED with (not replacing) the
 * category defaults, so a problem ends up with both its category tags and
 * these extra tags.
 *
 * Keys must exactly match the `title` field in the seed data.
 */
const TITLE_OVERRIDE_TAGS = {
    // Easy — Arrays
    'Find Maximum in Array':            ['Arrays', 'Two Pointers'],
    'Count Even Numbers':               ['Arrays', 'Math'],
    'Rotate Array Left':                ['Arrays', 'Two Pointers'],
    'Remove Duplicates from Array':     ['Arrays', 'Hash Map', 'Two Pointers'],
    'Intersection of Two Arrays':       ['Arrays', 'Hash Map', 'Sorting'],
    'Running Average of Array':         ['Arrays', 'Math'],
    'Array Prefix Sum':                 ['Arrays', 'Dynamic Programming'],

    // Easy — Strings
    'Reverse a String':                 ['Strings', 'Two Pointers'],
    'Count Vowels':                     ['Strings'],
    'Check Palindrome':                 ['Strings', 'Two Pointers'],
    'Capitalize First Letter of Words': ['Strings'],
    'Count Words in String':            ['Strings'],
    'Compress Repeating Characters':    ['Strings', 'Two Pointers'],
    'Anagram Check':                    ['Strings', 'Hash Map', 'Sorting'],
    'String to Integer (atoi)':         ['Strings', 'Math'],
    'Find First Non-Repeating Character':['Strings', 'Hash Map'],

    // Easy — Math
    'Sum of Two Integers':              ['Math'],
    'Fibonacci Number':                 ['Math', 'Recursion', 'Dynamic Programming'],
    'Is Prime':                         ['Math'],
    'Power of Two Check':               ['Math', 'Bit Manipulation'],
    'GCD and LCM':                      ['Math', 'Recursion'],
    'Digit Sum':                        ['Math', 'Recursion'],
    'Count Digits':                     ['Math'],
    'Roman to Integer':                 ['Math', 'Strings'],
    'Integer to Roman':                 ['Math', 'Strings'],

    // Easy — Stacks
    'Valid Parentheses':                ['Stacks', 'Strings'],
    'Reverse String Using Stack':       ['Stacks', 'Strings'],
    'Min Stack':                        ['Stacks'],

    // Medium — Arrays
    'Two Sum':                          ['Arrays', 'Hash Map', 'Two Pointers'],
    'Best Time to Buy and Sell Stock':  ['Arrays', 'Greedy', 'Dynamic Programming'],
    'Product of Array Except Self':     ['Arrays', 'Prefix Sum'],
    'Subarray Sum Equals K':            ['Arrays', 'Hash Map', 'Prefix Sum'],
    'Find All Duplicates in Array':     ['Arrays', 'Hash Map', 'Bit Manipulation'],
    '3Sum':                             ['Arrays', 'Sorting', 'Two Pointers'],
    'Container With Most Water':        ['Arrays', 'Two Pointers', 'Greedy'],
    'Spiral Matrix':                    ['Arrays'],
    'Rotate Image (Matrix)':            ['Arrays'],
    'Merge Intervals':                  ['Arrays', 'Sorting', 'Greedy'],
    'Find Peak Element':                ['Arrays', 'Binary Search', 'Divide & Conquer'],
    'Jump Game':                        ['Arrays', 'Greedy', 'Dynamic Programming'],

    // Medium — Strings
    'Longest Substring Without Repeating Characters': ['Strings', 'Hash Map', 'Sliding Window', 'Two Pointers'],
    'Group Anagrams':                   ['Strings', 'Hash Map', 'Sorting'],
    'Encode and Decode Strings':        ['Strings'],
    'Valid Anagram':                    ['Strings', 'Hash Map', 'Sorting'],
    'Longest Palindromic Substring':    ['Strings', 'Dynamic Programming', 'Two Pointers'],
    'Word Search':                      ['Strings', 'Backtracking', 'DFS', 'Graphs'],

    // Medium — Dynamic Programming
    'Climbing Stairs':                  ['Dynamic Programming', 'Math', 'Recursion'],
    'House Robber':                     ['Dynamic Programming', 'Arrays'],
    'Unique Paths':                     ['Dynamic Programming', 'Math'],
    'Coin Change':                      ['Dynamic Programming', 'Greedy'],
    'Longest Common Subsequence':       ['Dynamic Programming', 'Strings'],
    'Word Break':                       ['Dynamic Programming', 'Strings', 'Hash Map'],
    'Partition Equal Subset Sum':       ['Dynamic Programming', 'Arrays'],
    'Edit Distance':                    ['Dynamic Programming', 'Strings'],
    'Maximum Product Subarray':         ['Dynamic Programming', 'Arrays'],
    'Decode Ways':                      ['Dynamic Programming', 'Strings'],

    // Medium — Stacks
    'Daily Temperatures':               ['Stacks', 'Arrays', 'Monotone Stack'],
    'Evaluate Reverse Polish Notation': ['Stacks', 'Arrays', 'Math'],
    'Largest Rectangle in Histogram':   ['Stacks', 'Arrays', 'Divide & Conquer'],

    // Medium — Graphs
    'Number of Islands':                ['Graphs', 'BFS', 'DFS', 'Arrays'],
    'Clone Graph':                      ['Graphs', 'BFS', 'DFS'],
    'Pacific Atlantic Water Flow':      ['Graphs', 'BFS', 'DFS'],
    'Number of Connected Components':   ['Graphs', 'DFS', 'Union-Find'],
    'Redundant Connection':             ['Graphs', 'Union-Find'],

    // Medium — Trees
    'Binary Tree Inorder Traversal':    ['Trees', 'Recursion', 'DFS'],
    'Maximum Depth of Binary Tree':     ['Trees', 'Recursion', 'DFS', 'BFS'],
    'Symmetric Tree':                   ['Trees', 'Recursion', 'BFS'],
    'Level Order Traversal':            ['Trees', 'BFS', 'Queues'],
    'Validate Binary Search Tree':      ['Trees', 'Recursion', 'DFS'],
    'Lowest Common Ancestor of BST':    ['Trees', 'Recursion', 'DFS'],
    'Count Good Nodes in Binary Tree':  ['Trees', 'DFS', 'Recursion'],
    'Binary Tree Right Side View':      ['Trees', 'BFS'],

    // Medium — Linked Lists
    'Reverse Linked List':              ['Linked Lists', 'Recursion', 'Two Pointers'],
    'Merge Two Sorted Lists':           ['Linked Lists', 'Recursion', 'Divide & Conquer'],
    'Detect Cycle in Linked List':      ['Linked Lists', 'Two Pointers'],
    'Remove Nth Node from End':         ['Linked Lists', 'Two Pointers'],
    'Reorder List':                     ['Linked Lists', 'Two Pointers', 'Recursion'],
    'Find Middle of Linked List':       ['Linked Lists', 'Two Pointers'],

    // Medium — Heaps
    'K Largest Elements':               ['Heaps', 'Arrays', 'Sorting'],
    'Find Median from Data Stream':     ['Heaps', 'Sorting', 'Two Pointers'],
    'K Closest Points to Origin':       ['Heaps', 'Arrays', 'Sorting'],

    // Hard — various
    'Course Schedule (Topological Sort Feasibility)': ['Graphs', 'Topological Sort', 'DFS', 'BFS'],
    'Merge K Sorted Lists':             ['Heaps', 'Linked Lists', 'Divide & Conquer'],
    'Longest Consecutive Sequence':     ['Arrays', 'Hash Map'],
    'Minimum Window Substring':         ['Strings', 'Hash Map', 'Sliding Window', 'Two Pointers'],
};

/**
 * Returns the enriched tags array for a given problem, merging category
 * defaults with any title-specific overrides. The result is deduplicated.
 *
 * @param {string} title
 * @param {string} category
 * @param {string[]} existingTags - The problem's existing tags array (may be empty).
 * @returns {string[]}
 */
function enrichTags(title, category, existingTags = []) {
    const defaults = CATEGORY_DEFAULT_TAGS[category] || [];
    const overrides = TITLE_OVERRIDE_TAGS[title] || [];
    const merged = [...new Set([...existingTags, ...defaults, ...overrides])];
    return merged;
}

module.exports = { enrichTags, CATEGORY_DEFAULT_TAGS, TITLE_OVERRIDE_TAGS };
