# _document Error Notes

## Error Description
During build, there was a mention of `_document` error:
```
unhandledRejection Error [PageNotFoundError]: Cannot find module for page: /_document
```

## Context
- This error appeared during `npm run build`
- Not related to the glossary performance optimizations
- Likely related to Sanity Studio/PortableText renderer or a component expecting `_type`/`_key` fields

## Investigation Steps (if error reappears)
1. Check full stack trace: `npm run build 2>&1 | tee build.log`
2. Search for `_document` references in the codebase
3. Check Sanity Studio configuration files
4. Check PortableText renderer components
5. Look for components that might be expecting `_document` type

## Status
- Error was not consistently reproducible
- No immediate action needed
- Documented for future investigation if it reappears
