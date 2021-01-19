export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('@ioc:')) {
    return { url: `adonisjs://ioc?request=${encodeURIComponent(specifier)}` }
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export async function getFormat(url, context, defaultGetFormat) {
  if (url.startsWith('adonisjs://')) {
    return { format: 'module' }
  }
  return defaultGetFormat(url, context, defaultGetFormat)
}

const use = Symbol.for('ioc.use')

export async function getSource(url, context, defaultGetSource) {
  if (url.startsWith('adonisjs://')) {
    const urlObj = new URL(url)
    if (urlObj.host === 'ioc') {
      const bindingName = urlObj.searchParams.get('request').slice(5)
      const bindingValue = global[use](bindingName)
      return { source: buildModuleObject(bindingName, bindingValue) }
    } else {
      throw new Error(`unknown host for:${urlObj.href}`)
    }
  }
  return defaultGetSource(url, context, defaultGetSource)
}

function buildModuleObject(bindingName, bindingValue) {
  const result = [
    `const __module__ = global[Symbol.for("ioc.use")]('${bindingName}');`,
    'export default __module__;',
  ]
  for (const exportName of Object.keys(bindingValue)) {
    result.push(`export const ${exportName} = __module__['${exportName}']`)
  }
  return result.join('\n')
}
