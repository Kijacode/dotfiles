import url from 'url';

function getTracer() {
  return global.$_$tracer;
}

function getScratchFileUrl() {
  return getTracer()._esm.scratchFileUrl;
}

function getScratchFileContent() {
  return getTracer()._esm.scratchFileContent;
}

function getLocalProjectDirUrl() {
  return getTracer()._esm.localProjectDirUrl;
}

function getTempDirUrl() {
  return getTracer()._esm.tempDirUrl;
}

function getSettingsDirUrl() {
  return getTracer()._esm.settingsDirUrl;
}

// noinspection JSUnusedGlobalSymbols
export async function getSource(url, context, defaultGetSource) {
  const tracer = getTracer();
  if (tracer && tracer._esm) {
    if (url === getScratchFileUrl()) {
      return { source: getScratchFileContent() };
    }
  }

  return defaultGetSource(url, context, defaultGetSource);
}

export async function resolve(specifier, context, defaultResolve) {
  const tracer = getTracer();
  if (tracer && tracer._esm) {
    const scratchFileUrl = getScratchFileUrl();

    if (specifier === scratchFileUrl) {
      return { url: scratchFileUrl };
    }

    if (!specifier.startsWith('file:') && !specifier.startsWith('data:') && !specifier.startsWith('.')) {
      // bare import specifiers: node modules
      const localProjectDirUrl = getLocalProjectDirUrl();
      if (context.parentURL.startsWith(localProjectDirUrl)) {
        const parentURL = context.parentURL;
        try {
          return defaultResolve(specifier, context, defaultResolve);
        } catch (error) {
          if (error.code === 'ERR_MODULE_NOT_FOUND') {
            try {
              context.parentURL = parentURL.replace(localProjectDirUrl, getTempDirUrl());
              return await defaultResolve(specifier, context, defaultResolve);
            } catch (nestedError) {
              if (nestedError.code === 'ERR_MODULE_NOT_FOUND') {
                context.parentURL = parentURL.replace(localProjectDirUrl, getSettingsDirUrl());
                return await defaultResolve(specifier, context, defaultResolve);
              } else {
                throw nestedError;
              }
            }
          } else {
            throw error;
          }
        }
      }
    } else if (specifier.startsWith('.') || specifier.startsWith('file:')) {
      // relative or absolute specifiers: project files
      specifier = `${specifier}?session=${global.$_$session}`;

      const result = await defaultResolve(specifier, context, defaultResolve);

      tracer._doWhenReceiverIsReady(() => {
        tracer._send('module', { path: url.fileURLToPath(result.url) });
      });

      return result;
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}
