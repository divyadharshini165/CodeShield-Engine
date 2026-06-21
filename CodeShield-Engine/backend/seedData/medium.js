// 35 medium problems for the CodeShield-Engine question bank.
// Each problem includes a title, detailed description, difficulty/category
// tags, sample I/O, and 3-5 hidden test case vectors. Per-problem 'tags'
// arrays are enriched at seed time by seedData/tagMap.js (see seed.js).

module.exports = [
    {
        "title": "Two Sum",
        "description": "The first line contains an integer n. The second line contains n space-separated integers (the array). The third line contains an integer target. Find two distinct indices i and j (0-indexed, i < j) such that nums[i] + nums[j] equals target. Print the two indices separated by a space, in increasing order. Assume exactly one valid pair exists.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "4\n2 7 11 15\n9",
        "sampleOutput": "0 1",
        "testCases": [
            {
                "input": "4\n2 7 11 15\n9",
                "expectedOutput": "0 1"
            },
            {
                "input": "3\n3 2 4\n6",
                "expectedOutput": "1 2"
            },
            {
                "input": "2\n3 3\n6",
                "expectedOutput": "0 1"
            },
            {
                "input": "5\n-1 -2 -3 -4 -5\n-8",
                "expectedOutput": "2 4"
            },
            {
                "input": "6\n1 5 3 8 2 9\n10",
                "expectedOutput": "1 4"
            }
        ]
    },
    {
        "title": "Binary Search",
        "description": "The first line contains an integer n. The second line contains n space-separated integers sorted in ascending order. The third line contains an integer target. Using binary search, print the index (0-based) of target in the array, or -1 if it is not present.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\n1 3 5 7 9 11\n7",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "6\n1 3 5 7 9 11\n7",
                "expectedOutput": "3"
            },
            {
                "input": "5\n2 4 6 8 10\n5",
                "expectedOutput": "-1"
            },
            {
                "input": "1\n5\n5",
                "expectedOutput": "0"
            },
            {
                "input": "4\n1 2 3 4\n1",
                "expectedOutput": "0"
            },
            {
                "input": "4\n1 2 3 4\n4",
                "expectedOutput": "3"
            }
        ]
    },
    {
        "title": "Maximum Subarray Sum (Kadane's Algorithm)",
        "description": "The first line contains an integer n. The second line contains n space-separated integers (which may be negative). Print the maximum possible sum of a contiguous subarray (at least one element must be included).",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "9\n-2 1 -3 4 -1 2 1 -5 4",
        "sampleOutput": "6",
        "testCases": [
            {
                "input": "9\n-2 1 -3 4 -1 2 1 -5 4",
                "expectedOutput": "6"
            },
            {
                "input": "1\n-5",
                "expectedOutput": "-5"
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "15"
            },
            {
                "input": "4\n-1 -2 -3 -4",
                "expectedOutput": "-1"
            },
            {
                "input": "6\n5 -3 5 -3 5 -3",
                "expectedOutput": "9"
            }
        ]
    },
    {
        "title": "Valid Parentheses (Multiple Types)",
        "description": "Read a string containing only the characters '(', ')', '{', '}', '[' and ']'. Print \"true\" if the string is a valid sequence of balanced and correctly nested brackets, otherwise print \"false\".",
        "difficulty": "Medium",
        "category": "Stacks",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "{[()]}",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "{[()]}",
                "expectedOutput": "true"
            },
            {
                "input": "([)]",
                "expectedOutput": "false"
            },
            {
                "input": "{[]}",
                "expectedOutput": "true"
            },
            {
                "input": "(((",
                "expectedOutput": "false"
            },
            {
                "input": "",
                "expectedOutput": "true"
            }
        ]
    },
    {
        "title": "Merge Intervals",
        "description": "The first line contains an integer n, the number of intervals. Each of the next n lines contains two space-separated integers start and end representing an interval. Merge all overlapping intervals and print the resulting merged intervals, one per line in the format \"start end\", sorted by start value.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "4\n1 3\n2 6\n8 10\n15 18",
        "sampleOutput": "1 6\n8 10\n15 18",
        "testCases": [
            {
                "input": "4\n1 3\n2 6\n8 10\n15 18",
                "expectedOutput": "1 6\n8 10\n15 18"
            },
            {
                "input": "2\n1 4\n4 5",
                "expectedOutput": "1 5"
            },
            {
                "input": "1\n1 1",
                "expectedOutput": "1 1"
            },
            {
                "input": "3\n1 4\n0 4\n3 6",
                "expectedOutput": "0 6"
            },
            {
                "input": "3\n1 2\n3 4\n5 6",
                "expectedOutput": "1 2\n3 4\n5 6"
            }
        ]
    },
    {
        "title": "Group Anagrams Count",
        "description": "The first line contains an integer n. The next n lines each contain a lowercase word. Group the words that are anagrams of each other and print the number of distinct anagram groups.",
        "difficulty": "Medium",
        "category": "Strings",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\neat\ntea\ntan\nate\nnat\nbat",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "6\neat\ntea\ntan\nate\nnat\nbat",
                "expectedOutput": "3"
            },
            {
                "input": "1\nabc",
                "expectedOutput": "1"
            },
            {
                "input": "3\nabc\nbca\ncab",
                "expectedOutput": "1"
            },
            {
                "input": "4\nabc\ndef\nghi\njkl",
                "expectedOutput": "4"
            },
            {
                "input": "5\nlisten\nsilent\nenlist\ngoogle\ngoogel",
                "expectedOutput": "2"
            }
        ]
    },
    {
        "title": "Climbing Stairs",
        "description": "You are climbing a staircase with n steps. Each time you can climb either 1 or 2 steps. Read the integer n from standard input and print the number of distinct ways to reach the top.",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "5",
        "sampleOutput": "8",
        "testCases": [
            {
                "input": "5",
                "expectedOutput": "8"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "2",
                "expectedOutput": "2"
            },
            {
                "input": "10",
                "expectedOutput": "89"
            },
            {
                "input": "0",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "Breadth-First Search Traversal Order",
        "description": "The first line contains two space-separated integers n and m: the number of nodes (labeled 0 to n-1) and the number of undirected edges. Each of the next m lines contains two space-separated integers u v representing an edge. The last line contains the starting node. Print the BFS traversal order starting from the given node, visiting neighbors in increasing numeric order, as space-separated integers. Print only nodes reachable from the start.",
        "difficulty": "Medium",
        "category": "Graphs",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6 5\n0 1\n0 2\n1 3\n2 4\n3 5\n0",
        "sampleOutput": "0 1 2 3 4 5",
        "testCases": [
            {
                "input": "6 5\n0 1\n0 2\n1 3\n2 4\n3 5\n0",
                "expectedOutput": "0 1 2 3 4 5"
            },
            {
                "input": "1 0\n0",
                "expectedOutput": "0"
            },
            {
                "input": "3 1\n0 1\n0",
                "expectedOutput": "0 1"
            },
            {
                "input": "4 2\n0 1\n2 3\n2",
                "expectedOutput": "2 3"
            },
            {
                "input": "5 4\n0 1\n0 2\n1 3\n1 4\n0",
                "expectedOutput": "0 1 2 3 4"
            }
        ]
    },
    {
        "title": "Depth-First Search Traversal Order",
        "description": "The first line contains two space-separated integers n and m: the number of nodes (labeled 0 to n-1) and the number of undirected edges. Each of the next m lines contains two space-separated integers u v representing an edge. The last line contains the starting node. Print the DFS traversal order (preorder, visiting the smallest-numbered unvisited neighbor first) starting from the given node, as space-separated integers. Print only nodes reachable from the start.",
        "difficulty": "Medium",
        "category": "Graphs",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "5 4\n0 1\n0 2\n1 3\n1 4\n0",
        "sampleOutput": "0 1 3 4 2",
        "testCases": [
            {
                "input": "5 4\n0 1\n0 2\n1 3\n1 4\n0",
                "expectedOutput": "0 1 3 4 2"
            },
            {
                "input": "1 0\n0",
                "expectedOutput": "0"
            },
            {
                "input": "3 2\n0 1\n1 2\n0",
                "expectedOutput": "0 1 2"
            },
            {
                "input": "4 2\n0 1\n2 3\n2",
                "expectedOutput": "2 3"
            },
            {
                "input": "6 5\n0 1\n0 2\n1 3\n2 4\n3 5\n0",
                "expectedOutput": "0 1 3 5 2 4"
            }
        ]
    },
    {
        "title": "Longest Common Subsequence Length",
        "description": "Read two lines, each containing a lowercase string. Print the length of their Longest Common Subsequence (LCS).",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "abcde\nace",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "abcde\nace",
                "expectedOutput": "3"
            },
            {
                "input": "abc\nabc",
                "expectedOutput": "3"
            },
            {
                "input": "abc\ndef",
                "expectedOutput": "0"
            },
            {
                "input": "a\na",
                "expectedOutput": "1"
            },
            {
                "input": "aggtab\ngxtxayb",
                "expectedOutput": "4"
            }
        ]
    },
    {
        "title": "Coin Change - Minimum Coins",
        "description": "The first line contains an integer n, the number of coin denominations. The second line contains n space-separated positive integers (the denominations). The third line contains an integer amount. Print the minimum number of coins needed to make up amount. If it is not possible, print -1.",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "3\n1 2 5\n11",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "3\n1 2 5\n11",
                "expectedOutput": "3"
            },
            {
                "input": "1\n2\n3",
                "expectedOutput": "-1"
            },
            {
                "input": "1\n1\n0",
                "expectedOutput": "0"
            },
            {
                "input": "3\n1 2 5\n100",
                "expectedOutput": "20"
            },
            {
                "input": "2\n3 5\n7",
                "expectedOutput": "-1"
            }
        ]
    },
    {
        "title": "Implement a Min Stack",
        "description": "The first line contains an integer n, the number of operations. Each subsequent line is one of: \"PUSH x\" (push integer x), \"POP\" (remove top), or \"GETMIN\" (print current minimum element of the stack). Process operations in order, printing a line for every GETMIN operation. Assume the stack is never empty when POP or GETMIN is called.",
        "difficulty": "Medium",
        "category": "Stacks",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\nPUSH 3\nPUSH 5\nGETMIN\nPUSH 1\nGETMIN\nPOP",
        "sampleOutput": "3\n1",
        "testCases": [
            {
                "input": "6\nPUSH 3\nPUSH 5\nGETMIN\nPUSH 1\nGETMIN\nPOP",
                "expectedOutput": "3\n1"
            },
            {
                "input": "3\nPUSH 10\nGETMIN\nPOP",
                "expectedOutput": "10"
            },
            {
                "input": "5\nPUSH -1\nPUSH -5\nGETMIN\nPOP\nGETMIN",
                "expectedOutput": "-5\n-1"
            },
            {
                "input": "4\nPUSH 2\nPUSH 2\nGETMIN\nGETMIN",
                "expectedOutput": "2\n2"
            },
            {
                "input": "7\nPUSH 5\nPUSH 3\nPUSH 8\nGETMIN\nPOP\nPOP\nGETMIN",
                "expectedOutput": "3\n5"
            }
        ]
    },
    {
        "title": "Find Peak Element in Array",
        "description": "The first line contains an integer n. The second line contains n space-separated integers, where adjacent elements are never equal. A peak element is one strictly greater than its neighbors (boundary elements are compared with only their single neighbor). Print the index (0-based) of any peak element. If multiple peaks exist, printing the index of any one of them is accepted as correct, but for grading purposes print the FIRST peak found scanning left to right.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\n1 2 1 3 5 6",
        "sampleOutput": "1",
        "testCases": [
            {
                "input": "6\n1 2 1 3 5 6",
                "expectedOutput": "1"
            },
            {
                "input": "1\n5",
                "expectedOutput": "0"
            },
            {
                "input": "2\n1 2",
                "expectedOutput": "1"
            },
            {
                "input": "2\n2 1",
                "expectedOutput": "0"
            },
            {
                "input": "5\n1 3 2 4 1",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "Product of Array Except Self",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. For each index i, compute the product of all elements except nums[i], without using division. Print the resulting array as space-separated integers.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "4\n1 2 3 4",
        "sampleOutput": "24 12 8 6",
        "testCases": [
            {
                "input": "4\n1 2 3 4",
                "expectedOutput": "24 12 8 6"
            },
            {
                "input": "2\n3 5",
                "expectedOutput": "5 3"
            },
            {
                "input": "3\n0 1 2",
                "expectedOutput": "2 0 0"
            },
            {
                "input": "1\n10",
                "expectedOutput": "1"
            },
            {
                "input": "5\n1 1 1 1 1",
                "expectedOutput": "1 1 1 1 1"
            }
        ]
    },
    {
        "title": "Level Order Traversal of a Binary Tree",
        "description": "A binary tree is described on the first line as a space-separated sequence of integers in level order, where -1 represents a null/missing node (the root is never -1). Read this sequence and reconstruct the tree, then print its level order traversal where each level's values are printed on its own line, space-separated.",
        "difficulty": "Medium",
        "category": "Trees",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "1 2 3 -1 -1 4 5 -1 -1 -1 -1",
        "sampleOutput": "1\n2 3\n4 5",
        "testCases": [
            {
                "input": "1 2 3 -1 -1 4 5 -1 -1 -1 -1",
                "expectedOutput": "1\n2 3\n4 5"
            },
            {
                "input": "1 -1 -1",
                "expectedOutput": "1"
            },
            {
                "input": "1 2 -1 -1 -1",
                "expectedOutput": "1\n2"
            },
            {
                "input": "5 3 8 1 4 7 9 -1 -1 -1 -1 -1 -1 -1 -1",
                "expectedOutput": "5\n3 8\n1 4 7 9"
            },
            {
                "input": "10 -1 20 -1 -1",
                "expectedOutput": "10\n20"
            }
        ]
    },
    {
        "title": "Validate Binary Search Tree",
        "description": "A binary tree is described on the first line as a space-separated sequence of integers in level order, where -1 represents a null/missing node (the root is never -1). Print \"true\" if the tree is a valid Binary Search Tree (for every node, all values in its left subtree are strictly less than the node's value, and all values in its right subtree are strictly greater), otherwise print \"false\".",
        "difficulty": "Medium",
        "category": "Trees",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "2 1 3 -1 -1 -1 -1",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "2 1 3 -1 -1 -1 -1",
                "expectedOutput": "true"
            },
            {
                "input": "5 1 4 -1 -1 3 6 -1 -1 -1 -1",
                "expectedOutput": "false"
            },
            {
                "input": "1 -1 -1",
                "expectedOutput": "true"
            },
            {
                "input": "10 5 15 -1 -1 12 20 -1 -1 -1 -1",
                "expectedOutput": "true"
            },
            {
                "input": "10 5 15 -1 -1 6 20 -1 -1 -1 -1",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "Sliding Window Maximum Sum (Fixed Size)",
        "description": "The first line contains two space-separated integers n and k. The second line contains n space-separated integers. Print the maximum sum of any contiguous subarray of size exactly k.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "8 3\n1 4 2 10 2 3 1 5",
        "sampleOutput": "16",
        "testCases": [
            {
                "input": "8 3\n1 4 2 10 2 3 1 5",
                "expectedOutput": "16"
            },
            {
                "input": "5 1\n5 1 3 2 4",
                "expectedOutput": "5"
            },
            {
                "input": "4 4\n1 2 3 4",
                "expectedOutput": "10"
            },
            {
                "input": "6 2\n-1 -2 -3 -4 -5 -6",
                "expectedOutput": "-3"
            },
            {
                "input": "5 2\n2 2 2 2 2",
                "expectedOutput": "4"
            }
        ]
    },
    {
        "title": "Number of Islands",
        "description": "The first line contains two space-separated integers r and c. Each of the next r lines contains a string of c characters, each either '1' (land) or '0' (water). An island is formed by connecting adjacent lands horizontally or vertically. Print the number of islands.",
        "difficulty": "Medium",
        "category": "Graphs",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "4 5\n11000\n11000\n00100\n00011",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "4 5\n11000\n11000\n00100\n00011",
                "expectedOutput": "3"
            },
            {
                "input": "1 1\n1",
                "expectedOutput": "1"
            },
            {
                "input": "1 1\n0",
                "expectedOutput": "0"
            },
            {
                "input": "3 3\n111\n111\n111",
                "expectedOutput": "1"
            },
            {
                "input": "2 2\n10\n01",
                "expectedOutput": "2"
            }
        ]
    },
    {
        "title": "Knapsack Problem (0/1)",
        "description": "The first line contains two space-separated integers n and capacity. The second line contains n space-separated integers representing item weights. The third line contains n space-separated integers representing item values. Print the maximum total value achievable without exceeding the given capacity, where each item may be used at most once.",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "3 50\n10 20 30\n60 100 120",
        "sampleOutput": "220",
        "testCases": [
            {
                "input": "3 50\n10 20 30\n60 100 120",
                "expectedOutput": "220"
            },
            {
                "input": "1 10\n5\n10",
                "expectedOutput": "10"
            },
            {
                "input": "1 4\n5\n10",
                "expectedOutput": "0"
            },
            {
                "input": "4 10\n1 2 3 4\n10 20 30 40",
                "expectedOutput": "100"
            },
            {
                "input": "2 0\n1 2\n10 20",
                "expectedOutput": "0"
            }
        ]
    },
    {
        "title": "Sort Linked List Values (Array Representation)",
        "description": "The first line contains an integer n. The second line contains n space-separated integers representing the values of a singly linked list in their current order. Sort the linked list values using merge sort and print the sorted values as space-separated integers.",
        "difficulty": "Medium",
        "category": "Linked Lists",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "5\n4 2 1 3 5",
        "sampleOutput": "1 2 3 4 5",
        "testCases": [
            {
                "input": "5\n4 2 1 3 5",
                "expectedOutput": "1 2 3 4 5"
            },
            {
                "input": "1\n1",
                "expectedOutput": "1"
            },
            {
                "input": "4\n-1 -3 0 2",
                "expectedOutput": "-3 -1 0 2"
            },
            {
                "input": "6\n3 3 3 1 1 2",
                "expectedOutput": "1 1 2 3 3 3"
            },
            {
                "input": "2\n2 1",
                "expectedOutput": "1 2"
            }
        ]
    },
    {
        "title": "Detect Cycle in a Linked List (Array Representation)",
        "description": "The first line contains an integer n, the number of nodes (numbered 0 to n-1) in a singly linked list. The second line contains n space-separated integers representing, for each node i, the index of the node it points to, or -1 if it points to nothing. The list starts at node 0. Print \"true\" if the linked list contains a cycle, otherwise print \"false\".",
        "difficulty": "Medium",
        "category": "Linked Lists",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "4\n1 2 3 1",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "4\n1 2 3 1",
                "expectedOutput": "true"
            },
            {
                "input": "4\n1 2 3 -1",
                "expectedOutput": "false"
            },
            {
                "input": "1\n-1",
                "expectedOutput": "false"
            },
            {
                "input": "1\n0",
                "expectedOutput": "true"
            },
            {
                "input": "5\n1 2 3 4 -1",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Read a string s from standard input. Print the length of the longest substring of s without repeating characters.",
        "difficulty": "Medium",
        "category": "Strings",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "abcabcbb",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "abcabcbb",
                "expectedOutput": "3"
            },
            {
                "input": "bbbbb",
                "expectedOutput": "1"
            },
            {
                "input": "pwwkew",
                "expectedOutput": "3"
            },
            {
                "input": "",
                "expectedOutput": "0"
            },
            {
                "input": "abcdefg",
                "expectedOutput": "7"
            }
        ]
    },
    {
        "title": "Rotate Matrix 90 Degrees Clockwise",
        "description": "The first line contains an integer n. The next n lines each contain n space-separated integers representing an n x n matrix. Print the matrix rotated 90 degrees clockwise, n lines each with n space-separated integers.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "3\n1 2 3\n4 5 6\n7 8 9",
        "sampleOutput": "7 4 1\n8 5 2\n9 6 3",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9",
                "expectedOutput": "7 4 1\n8 5 2\n9 6 3"
            },
            {
                "input": "1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "2\n1 2\n3 4",
                "expectedOutput": "3 1\n4 2"
            },
            {
                "input": "2\n1 1\n1 1",
                "expectedOutput": "1 1\n1 1"
            },
            {
                "input": "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16",
                "expectedOutput": "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4"
            }
        ]
    },
    {
        "title": "Find All Pairs with Given Sum",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. The third line contains an integer target. Print all unique pairs (a, b) with a <= b such that a + b = target and both values exist in the array (each value used as needed), one pair per line in the format \"a b\", sorted by a ascending. If no such pairs exist, print \"None\".",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\n1 5 7 -1 5 3\n6",
        "sampleOutput": "-1 7\n1 5",
        "testCases": [
            {
                "input": "6\n1 5 7 -1 5 3\n6",
                "expectedOutput": "-1 7\n1 5"
            },
            {
                "input": "3\n1 2 3\n10",
                "expectedOutput": "None"
            },
            {
                "input": "4\n2 2 2 2\n4",
                "expectedOutput": "2 2"
            },
            {
                "input": "2\n0 0\n0",
                "expectedOutput": "0 0"
            },
            {
                "input": "5\n1 2 3 4 5\n5",
                "expectedOutput": "1 4\n2 3"
            }
        ]
    },
    {
        "title": "Run-Length Encoding",
        "description": "Read a string from standard input and print its run-length encoding, where each maximal run of identical consecutive characters is replaced by the character followed by the count of its occurrences (always include the count, even if it is 1).",
        "difficulty": "Medium",
        "category": "Strings",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "aaabccccd",
        "sampleOutput": "a3b1c4d1",
        "testCases": [
            {
                "input": "aaabccccd",
                "expectedOutput": "a3b1c4d1"
            },
            {
                "input": "abc",
                "expectedOutput": "a1b1c1"
            },
            {
                "input": "aaaa",
                "expectedOutput": "a4"
            },
            {
                "input": "a",
                "expectedOutput": "a1"
            },
            {
                "input": "aabbcc",
                "expectedOutput": "a2b2c2"
            }
        ]
    },
    {
        "title": "Spiral Matrix Traversal",
        "description": "The first line contains two space-separated integers r and c. The next r lines each contain c space-separated integers. Print the elements of the matrix in spiral order (starting from the top-left, moving right), as space-separated integers.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "sampleOutput": "1 2 3 6 9 8 7 4 5",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
                "expectedOutput": "1 2 3 6 9 8 7 4 5"
            },
            {
                "input": "1 1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "1 4\n1 2 3 4",
                "expectedOutput": "1 2 3 4"
            },
            {
                "input": "4 1\n1\n2\n3\n4",
                "expectedOutput": "1 2 3 4"
            },
            {
                "input": "2 2\n1 2\n3 4",
                "expectedOutput": "1 2 4 3"
            }
        ]
    },
    {
        "title": "Find the Kth Largest Element",
        "description": "The first line contains two space-separated integers n and k. The second line contains n space-separated integers. Print the k-th largest element in the array (1st largest is the maximum).",
        "difficulty": "Medium",
        "category": "Heaps",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6 2\n3 2 1 5 6 4",
        "sampleOutput": "5",
        "testCases": [
            {
                "input": "6 2\n3 2 1 5 6 4",
                "expectedOutput": "5"
            },
            {
                "input": "5 1\n1 2 3 4 5",
                "expectedOutput": "5"
            },
            {
                "input": "5 5\n1 2 3 4 5",
                "expectedOutput": "1"
            },
            {
                "input": "3 2\n7 7 7",
                "expectedOutput": "7"
            },
            {
                "input": "9 4\n3 2 3 1 2 4 5 5 6",
                "expectedOutput": "4"
            }
        ]
    },
    {
        "title": "Find the Longest Word",
        "description": "Read a line of space-separated words from standard input and print the longest word. If multiple words share the maximum length, print the first one encountered.",
        "difficulty": "Medium",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "the quick brown fox jumps",
        "sampleOutput": "quick",
        "testCases": [
            {
                "input": "the quick brown fox jumps",
                "expectedOutput": "quick"
            },
            {
                "input": "a bb ccc",
                "expectedOutput": "ccc"
            },
            {
                "input": "equal size word here",
                "expectedOutput": "equal"
            },
            {
                "input": "single",
                "expectedOutput": "single"
            },
            {
                "input": "cat dog elephant ant",
                "expectedOutput": "elephant"
            }
        ]
    },
    {
        "title": "Stack Implementation - Push and Pop Sequence",
        "description": "The first line contains an integer n, the number of operations. Each of the next n lines is either \"PUSH x\" (push integer x onto the stack) or \"POP\" (remove the top element). After processing all operations, print the final stack contents from bottom to top as space-separated integers. If the stack is empty, print \"EMPTY\". Assume POP is never called on an empty stack.",
        "difficulty": "Medium",
        "category": "Stacks",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "4\nPUSH 1\nPUSH 2\nPUSH 3\nPOP",
        "sampleOutput": "1 2",
        "testCases": [
            {
                "input": "4\nPUSH 1\nPUSH 2\nPUSH 3\nPOP",
                "expectedOutput": "1 2"
            },
            {
                "input": "2\nPUSH 5\nPOP",
                "expectedOutput": "EMPTY"
            },
            {
                "input": "3\nPUSH 1\nPUSH 2\nPUSH 3",
                "expectedOutput": "1 2 3"
            },
            {
                "input": "1\nPUSH 100",
                "expectedOutput": "100"
            },
            {
                "input": "5\nPUSH 1\nPOP\nPUSH 2\nPUSH 3\nPOP",
                "expectedOutput": "2"
            }
        ]
    },
    {
        "title": "Queue Implementation - Enqueue and Dequeue Sequence",
        "description": "The first line contains an integer n, the number of operations. Each of the next n lines is either \"ENQUEUE x\" (add integer x to the back of the queue) or \"DEQUEUE\" (remove the front element). After processing all operations, print the final queue contents from front to back as space-separated integers. If the queue is empty, print \"EMPTY\". Assume DEQUEUE is never called on an empty queue.",
        "difficulty": "Medium",
        "category": "Queues",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "4\nENQUEUE 1\nENQUEUE 2\nENQUEUE 3\nDEQUEUE",
        "sampleOutput": "2 3",
        "testCases": [
            {
                "input": "4\nENQUEUE 1\nENQUEUE 2\nENQUEUE 3\nDEQUEUE",
                "expectedOutput": "2 3"
            },
            {
                "input": "2\nENQUEUE 5\nDEQUEUE",
                "expectedOutput": "EMPTY"
            },
            {
                "input": "3\nENQUEUE 1\nENQUEUE 2\nENQUEUE 3",
                "expectedOutput": "1 2 3"
            },
            {
                "input": "1\nENQUEUE 99",
                "expectedOutput": "99"
            },
            {
                "input": "5\nENQUEUE 1\nDEQUEUE\nENQUEUE 2\nENQUEUE 3\nDEQUEUE",
                "expectedOutput": "3"
            }
        ]
    },
    {
        "title": "Matrix Transpose",
        "description": "The first line contains two space-separated integers r and c (rows and columns). The next r lines each contain c space-separated integers representing the matrix. Print the transpose of the matrix: c lines, each containing r space-separated integers.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "2 3\n1 2 3\n4 5 6",
        "sampleOutput": "1 4\n2 5\n3 6",
        "testCases": [
            {
                "input": "2 3\n1 2 3\n4 5 6",
                "expectedOutput": "1 4\n2 5\n3 6"
            },
            {
                "input": "1 1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "3 1\n1\n2\n3",
                "expectedOutput": "1 2 3"
            },
            {
                "input": "1 3\n1 2 3",
                "expectedOutput": "1\n2\n3"
            },
            {
                "input": "2 2\n1 2\n3 4",
                "expectedOutput": "1 3\n2 4"
            }
        ]
    },
    {
        "title": "Find Duplicate Elements",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. Print all elements that appear more than once, in the order of their first occurrence, separated by spaces. If there are no duplicates, print \"None\".",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "7\n1 2 3 2 4 1 5",
        "sampleOutput": "1 2",
        "testCases": [
            {
                "input": "7\n1 2 3 2 4 1 5",
                "expectedOutput": "1 2"
            },
            {
                "input": "4\n1 2 3 4",
                "expectedOutput": "None"
            },
            {
                "input": "5\n5 5 5 5 5",
                "expectedOutput": "5"
            },
            {
                "input": "1\n9",
                "expectedOutput": "None"
            },
            {
                "input": "6\n3 1 3 2 2 1",
                "expectedOutput": "3 1 2"
            }
        ]
    },
    {
        "title": "Caesar Cipher Encryption",
        "description": "The first line contains a lowercase string s (letters a-z only). The second line contains an integer shift. Print s with each letter shifted forward in the alphabet by shift positions, wrapping around from 'z' back to 'a'.",
        "difficulty": "Medium",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "abc\n2",
        "sampleOutput": "cde",
        "testCases": [
            {
                "input": "abc\n2",
                "expectedOutput": "cde"
            },
            {
                "input": "xyz\n3",
                "expectedOutput": "abc"
            },
            {
                "input": "hello\n0",
                "expectedOutput": "hello"
            },
            {
                "input": "a\n26",
                "expectedOutput": "a"
            },
            {
                "input": "z\n1",
                "expectedOutput": "a"
            }
        ]
    },
    {
        "title": "Pascal's Triangle Row",
        "description": "Read an integer n (0-indexed row number) from standard input and print the n-th row of Pascal's Triangle as space-separated integers.",
        "difficulty": "Medium",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "4",
        "sampleOutput": "1 4 6 4 1",
        "testCases": [
            {
                "input": "4",
                "expectedOutput": "1 4 6 4 1"
            },
            {
                "input": "0",
                "expectedOutput": "1"
            },
            {
                "input": "1",
                "expectedOutput": "1 1"
            },
            {
                "input": "2",
                "expectedOutput": "1 2 1"
            },
            {
                "input": "5",
                "expectedOutput": "1 5 10 10 5 1"
            }
        ]
    },
    {
        "title": "Merge Two Sorted Arrays",
        "description": "The first line contains two space-separated integers n and m, the sizes of the two arrays. The second line contains n space-separated sorted integers. The third line contains m space-separated sorted integers. Print the merged sorted array as space-separated integers.",
        "difficulty": "Medium",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "3 3\n1 3 5\n2 4 6",
        "sampleOutput": "1 2 3 4 5 6",
        "testCases": [
            {
                "input": "3 3\n1 3 5\n2 4 6",
                "expectedOutput": "1 2 3 4 5 6"
            },
            {
                "input": "0 3\n\n1 2 3",
                "expectedOutput": "1 2 3"
            },
            {
                "input": "2 0\n5 10\n",
                "expectedOutput": "5 10"
            },
            {
                "input": "1 1\n1\n1",
                "expectedOutput": "1 1"
            },
            {
                "input": "4 2\n1 2 3 4\n0 5",
                "expectedOutput": "0 1 2 3 4 5"
            }
        ]
    }
];
