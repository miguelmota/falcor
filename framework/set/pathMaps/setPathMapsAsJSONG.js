function setPathMapsAsJSONG(model, pathMaps, values, errorSelector, boundPath) {
    
    ++__GENERATION_VERSION;
    
    var nodeRoot = model._cache || (model._cache = {}),
        nodeParent = nodeRoot, node = nodeParent,
        boundLength = 0;
    
    boundPath = model._path || [];
    
    var root       = model._root  || model,
        boxed      = model._boxed || false,
        expired    = root.expired || (root.expired = []),
        refreshing = model._refreshing || false,
        appendNullKey = false;
    
    (typeof errorSelector === "function") || (errorSelector = model._errorSelector) || (errorSelector = function(x, y){return y;});
    
    default var pathMaps <-
        pathMapStack: [],
        nodes: [], jsons: [],
        errors: [], refs: [],
        depth: 0, refIndex: 0, refDepth: 0,
        requestedPath: [], optimizedPath: [],
        requestedPaths: [], optimizedPaths: [],
        requestedMissingPaths: [], optimizedMissingPaths: [],
        hasValue: false,
        jsonRoot: values && values[0], jsonParent: jsonRoot, jsonNode: jsonParent;
    
    var pathMap, length = 0, height = 0, reference, refLength = 0, refHeight = 0,
        nodeType, nodeValue, nodeSize, nodeTimestamp, nodeExpires;
    
    refs[-1]  = boundPath;
    nodes[-1] = nodeParent;
    jsons[-1] = jsonParent;
    jsons[-2] = jsons;
    
    curried errorSelector2 = errorSelector(requestedPath);
    
    NodeMixin(root, expired, errorSelector2, pathMap)
    NodeMixin(root, expired, errorSelector2, node)
    NodeMixin(root, expired, errorSelector2, nodeParent)
    NodeMixin(root, expired, errorSelector2, jsonNode)
    NodeMixin(root, expired, errorSelector2, jsonParent)
    NodeMixin(root, expired, errorSelector2, jsonRoot)
    
    curried initMapStack       = initPathMapStack(pathMapStack),
            unwindMapStack     = unwindPathMap(pathMapStack),
            checkNodeExpired   = checkExpired(visit),
            setEmptyNode       = setNode(checkNodeExpired),
            setEdgeValue       = setEdge(checkNodeExpired, pathMap),
            checkEdgeExpired   = checkExpiredOrPromote(setEdgeValue),
            optimizeJSONGRefN  = addRequestedKey(setEmptyNode, optimizedPath),
            getJSONGRefNode    = nodeAsJSONG(optimizeJSONGRefN, jsonParent, jsonNode, boxed),
            getJSONGRefEdge    = setHardLink(getJSONGRefNode, reference),
            setReferenceNode   = walkReference(keySetFalse, getJSONGRefNode, getJSONGRefEdge, appendNullKey, reference),
            
            requestedJSONGKey  = getRequestedKeySet(noop, requestedPath, boundLength),
            optimizeJSONGNode  = addOptimizedKey(setEmptyNode, optimizedPath, refIndex, refLength),
            optimizeJSONGEdge  = addOptimizedKey(checkEdgeExpired, optimizedPath, refIndex, refLength),
            
            setJSONGNode       = nodeAsJSONG(optimizeJSONGNode, jsonParent, jsonNode, boxed),
            setJSONGEdge       = edgeAsJSONG(optimizeJSONGEdge, jsons, jsonParent, boxed),
            followJSONGRef     = followPathSetRef(setReferenceNode, optimizedPath, reference, refs, refIndex, refDepth, refHeight, refLength),
            setOptimizedNode   = optimizeNode(setJSONGNode, followJSONGRef),
            
            onJSONGNext        = onNext(requestedPath, optimizedPath, requestedPaths, optimizedPaths, appendNullKey),
            onJSONGNext2       = nextAsPathMap(onJSONGNext, hasValue, jsons, jsonParent, boxed),
            onJSONGError       = onErrorAsJSONG(errors, boxed, requestedPath),
            onJSONGMiss        = onPathMapMiss(boundPath, boundLength, requestedPath, optimizedPath, requestedMissingPaths, optimizedMissingPaths, pathMapStack),
            
            setPathMapAsJSONG  = walkPathMap(requestedJSONGKey, setOptimizedNode, setJSONGEdge, appendNullKey, pathMapStack, pathMap),
            setPathMapComboAsJSONG = walkPathSetCombo(
                setPathMapAsJSONG, unwindMapStack,
                onJSONGNext2, onJSONGError, onJSONGMiss,
                boxed, refreshing, appendNullKey,
                refs, refIndex, refLength,
                requestedPath, optimizedPath
            );
    
    values = walkPathSets(
        initMapStack, setPathMapComboAsJSONG, pathMaps,
        pathMap, depth, length, height,
        nodes, nodeRoot, nodeParent, node,
        jsons, jsonRoot, jsonParent, jsonNode,
        nodeType, nodeValue, nodeSize, nodeTimestamp, nodeExpires
    )
    
    values && (values[0] = hasValue && {
        paths: requestedPaths,
        jsong: jsons[-1]
    } || undefined);
    
    return {
        "values": values,
        "errors": errors,
        "requestedPaths": requestedPaths,
        "optimizedPaths": optimizedPaths,
        "requestedMissingPaths": requestedMissingPaths,
        "optimizedMissingPaths": optimizedMissingPaths
    };
}