from __future__ import division
import copy

def compress(row):
    compressed = []
    column = 0
    while column < 10:
        value = row[column]
        compressed.append(value)
        if (value == 0):
            column += 1
        else:
            column += value
    return compressed

def generateText(rods, row):
    if (len(rods) <= 2):
        return str(rods).strip('[]').replace(',', ' and') + ' (row ' + str(row) + '), '
    else:
        return str(rods).strip('[]').replace(',', ' and').replace(' and', ',', len(rods)-2) + ' (row ' + str(row) + '), '

def calculateSolutionNumber(n, m_max):
    # n is the target result
    # m is the maxium number of rods in the solution

    # requires n >= 3
    if (n < 3):
        return 0
    # requires m >= 2
    if (m_max < 2):
        return 0
    # requires n >= m
    if (n < m_max):
        m_max = n

    count = 0
    for i in range(2, m_max+1):
        S = -(i**2) + n*i - n + i + 1
        count = count + S
    return count

def detectChanges(new_data, old_data):

    placed_text = ""
    moved_text = ""
    removed_text = ""
    actions_count = 0
    row = 0

    for new, old in zip(new_data, old_data):

        # dected rods that remained
        remained = compress(old)
        [remained.remove(a) for a in compress(old) if (a not in compress(new)) and (a != 0)]
        remained = [x for x in remained if x != 0]

        # detect rods that were added
        added = compress(new)
        [added.remove(a) for a in remained if a in added]
        added = [x for x in added if x != 0]

        # detect rods that were removed
        removed = compress(old)
        [removed.remove(a) for a in remained if a in removed]
        removed = [x for x in removed if x != 0]

        # detect rods that were moved
        column = 0
        moved = remained[:]
        both = zip(new, old)
        while column < 10:
            a = both[column][0]
            b = both[column][1]
            if (a == 0):
                column += 1
            else:
                if a == b:
                    moved.remove(a)
                column += a

        # return changes
        if (removed != [] and removed != [0]):
            actions_count += len(removed)
            removed_text += generateText(removed, row)
        if (added != [] and added != [0]):
            actions_count += len(added)
            placed_text += generateText(added, row)
        if (remained != [] and remained != [0] and moved != [] and moved != [0]):
            actions_count += len(moved)
            moved_text += generateText(moved, row)

        row += 1

    if (placed_text != ""):
        placed_text = "Placed " + placed_text[:-2]
    if (moved_text != ""):
        moved_text = "Moved " + moved_text[:-2]
    if (removed_text != ""):
        removed_text = "Removed " + removed_text[:-2]
    text = placed_text + ' / ' + moved_text + ' / ' + removed_text
    return [text, actions_count]

def checkNumberBonds(rods, target, solution_max_size, solutions_found):

    print "target", target

    success_count = 0
    text = ""
    for idx,row in enumerate(rods):
        result = 0
        solution = []
        for value in compress(row):
            if value == 0:
                result = 0
                solution = []
            else:
                result += value
                solution.append(value)
            if (result == target and len(solution) >= 2 and len(solution) <= solution_max_size and value != target and solution not in solutions_found):
                success_count += 1
                solutions_found.append(solution)
                text += str(solution).strip('[]').replace(', ', '+') + ' (row ' + str(idx) + '), '

    if (success_count > 0):
        if (success_count == 1):
            text = "Found 1 new solution: " + text[:-2]
        else:
            text = "Found " + str(success_count) + " new solutions: " + text[:-2]
    else:
        text = "-"

    return [text, success_count]

def processData(new_data, old_data, activity, old_stats):

    stats = copy.deepcopy(old_stats)

    # if it is the first event, just look for new rods
    if (old_data is None):
        actions_count = 0
        text = ""
        for idx, row in enumerate(new_data):
            # detect rods that were added
            added = compress(row)
            # remove zeros
            added = [x for x in added if x != 0]
            # count actions and generate text
            if (added != [] and added != [0]):
                actions_count += len(list(added))
                text += generateText(list(added), idx)
        if (text != ""):
            stats["actions_count"] += actions_count
            actions = "Placed " + text[:-2]

    # else compare to previous event to detect changes
    else:
        [text, actions_count] = detectChanges(new_data, old_data)
        stats["actions_count"] += actions_count
        actions = text

    # check results and calculate statistics only if there is an activity and it is not paused
    if (activity.type.id != 0 and activity.paused == False):

        # get results based on exercise type
        if (activity.type.name == "Number Bonds"):
            [text, success_count] = checkNumberBonds(new_data, activity.type.target, activity.type.solution_max_size, stats["solutions_found"])
            stats["success_count"] += success_count
            success_max_count = calculateSolutionNumber(activity.type.target, activity.type.solution_max_size)

        # calculate statistics based on results obtained
        stats["progression"] = int(stats["success_count"] / success_max_count * 100)
        stats["accuracy"] = int(stats["success_count"] / stats["actions_count"] *100)
        #stats["fluency"] = ...
        outcomes = text
    else:
        outcomes = "-"

    return [actions, outcomes, stats]
