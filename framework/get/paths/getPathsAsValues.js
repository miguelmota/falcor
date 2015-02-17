function getPathsAsValues(model, pathSets, values, errorSelector, boundPath) {
    
    Array.isArray(values) && (values.length = 0);
    
    var boundLength = 0,
        nodeRoot = model._cache || (model._cache = {}),
        nodeParent, node;
    
    if(Array.isArray(boundPath)) {
        nodeParent  = nodeRoot;
        boundLength = boundPath.length;
    } else {
        nodeParent  = getBoundContext(model);
        boundPath   = model._path || [];
    }
    
    var root       = model._root  || model,
        boxed      = model._boxed || false,
        expired    = root.expired || (root.expired = []),
        refreshing = model._refreshing || false,
        appendNullKey = false;
    
    (typeof errorSelector === "function") || (errorSelector = model._errorSelector) || (errorSelector = function(x, y){return y;});
    
    default var pathSets <-
        nodes: [],
        errors: [], refs: [],
        depth: 0, refIndex: 0, refDepth: 0,
        requestedPath: [], optimizedPath: [],
        requestedPaths: [], optimizedPaths: [],
        requestedMissingPaths: [], optimizedMissingPaths: [];
    
    var path, length = 0, height = 0, reference, refLength = 0, refHeight = 0,
        nodeType, nodeValue, nodeSize, nodeTimestamp, nodeExpires;
    
    refs[-1]  = boundPath;
    nodes[-1] = nodeParent;
    
    curried errorSelector2 = errorSelector(requestedPath);
    
    NodeMixin(root, expired, errorSelector2, node)
    NodeMixin(root, expired, errorSelector2, nodeParent)
    
    curried checkNodeExpired = checkExpired(visit),
            checkEdgeExpired = checkExpiredOrPromote(visit),
            optimizeRefN     = addRequestedKey(checkNodeExpired, optimizedPath),
            optimizeRefE     = setHardLink(optimizeRefN, reference),
            getReferenceNode = walkReference(keySetFalse, optimizeRefN, optimizeRefE, appendNullKey, reference),
            getHardRefNode   = followHardRef(getReferenceNode, optimizedPath),
            
            requestedKey     = getRequestedKeySet(getKeySet, requestedPath, boundLength),
            optimizedNode    = addOptimizedKey(checkNodeExpired, optimizedPath, refIndex, refLength),
            optimizedEdge    = addOptimizedKey(checkEdgeExpired, optimizedPath, refIndex, refLength),
            
            followNodeRef    = followPathSetRef(getHardRefNode, optimizedPath, reference, refs, refIndex, refDepth, refHeight, refLength),
            getOptimizedNode = optimizeNode(optimizedNode, followNodeRef),
            
            onValueNext      = onNext(requestedPath, optimizedPath, requestedPaths, optimizedPaths, appendNullKey),
            onValueNext2     = nextAsValue(onValueNext, values, boxed, node, nodeValue, requestedPath, appendNullKey),
            onValueError     = onError(errors, boxed, requestedPath, appendNullKey),
            onValueMiss      = onPathSetMiss(boundPath, boundLength, requestedPath, optimizedPath, requestedMissingPaths, optimizedMissingPaths),
            
            getPathSet = walkPathSet(requestedKey, getOptimizedNode, optimizedEdge, appendNullKey, path),
            getPathSetCombo = walkPathSetCombo(
                getPathSet, unwindPath,
                onValueNext2, onValueError, onValueMiss,
                boxed, refreshing, appendNullKey,
                refs, refIndex, refLength,
                requestedPath, optimizedPath
            );
    
    values = walkPathSets(
        noop, getPathSetCombo, pathSets,
        path, depth, length, height,
        nodes, nodeRoot, nodeParent, node,
        nodeType, nodeValue, nodeSize, nodeTimestamp, nodeExpires
    )
    
    return {
        "values": values,
        "errors": errors,
        "requestedPaths": requestedPaths,
        "optimizedPaths": optimizedPaths,
        "requestedMissingPaths": requestedMissingPaths,
        "optimizedMissingPaths": optimizedMissingPaths
    };
}
