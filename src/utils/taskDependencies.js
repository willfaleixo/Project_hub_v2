/**
 * Detects if adding a dependency from `taskId` to `dependencyId` introduces a cycle.
 * @param {Array} tasks - List of all task objects in the project
 * @param {string} taskId - The ID of the task being edited or created (can be null/temp for new task)
 * @param {string} dependencyId - The ID of the proposed predecessor task
 * @returns {boolean} true if cycle detected, false if safe
 */
export function hasCircularDependency(tasks = [], taskId, dependencyId) {
  if (!dependencyId) return false;
  if (taskId && taskId === dependencyId) return true;

  // Build adj list: task -> array of dependency task IDs
  const graph = {};
  tasks.forEach(t => {
    graph[t.id] = t.dependsOn || [];
  });

  // Temporarily add the proposed dependency link: taskId depends on dependencyId
  if (taskId) {
    graph[taskId] = [...(graph[taskId] || []), dependencyId];
  }

  // Check if starting from dependencyId we can reach taskId (or form a cycle)
  const visited = new Set();
  const recStack = new Set();

  function dfs(currId) {
    if (recStack.has(currId)) return true;
    if (visited.has(currId)) return false;

    visited.add(currId);
    recStack.add(currId);

    const deps = graph[currId] || [];
    for (const dep of deps) {
      if (dfs(dep)) return true;
    }

    recStack.delete(currId);
    return false;
  }

  return dfs(dependencyId);
}

/**
 * Checks if all predecessor dependencies of a task are completed.
 * @param {Object} task 
 * @param {Array} allTasks 
 * @returns {Object} { canStart: boolean, pendingDependencies: Array }
 */
export function getDependencyStatus(task, allTasks = []) {
  if (!task.dependsOn || task.dependsOn.length === 0) {
    return { canStart: true, pendingDependencies: [] };
  }

  const pending = [];
  task.dependsOn.forEach(depId => {
    const parent = allTasks.find(t => t.id === depId);
    if (parent && !parent.completed) {
      pending.push(parent);
    }
  });

  return {
    canStart: pending.length === 0,
    pendingDependencies: pending
  };
}
