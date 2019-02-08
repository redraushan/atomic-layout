import defaultOptions, {
  DefaultBreakpointNames,
  LayoutOptions,
  Breakpoint,
} from './const/defaultOptions'
import invariant from './utils/invariant'

class Layout {
  public options: LayoutOptions<DefaultBreakpointNames>
  protected isConfigureCalled: boolean = false

  constructor(options: Partial<LayoutOptions>) {
    return this.configure(options, false)
  }

  /**
   * Provides global layout configuration.
   */
  public configure<BreakpointNames extends string = DefaultBreakpointNames>(
    options: Partial<LayoutOptions<BreakpointNames>>,
    warnOnMultiple: boolean = true,
  ) {
    if (warnOnMultiple) {
      invariant(
        !this.isConfigureCalled,
        'Failed to configure Layout: do not call `Layout.configure()` more than once. Layout configuration must remain consistent throughout the application.',
      )
    }

    invariant(
      options && typeof options === 'object',
      'Failed to configure Layout: expected options to be an Object, but got: %o.',
      typeof options,
    )

    this.options = {
      ...defaultOptions,
      ...options,
    }

    const { defaultBreakpointName } = this.options
    invariant(
      defaultBreakpointName && typeof defaultBreakpointName === 'string',
      'Failed to configure Layout: expected "defaultBreakpointName" property set, but got: %s.',
      defaultBreakpointName,
    )

    invariant(
      this.options.breakpoints,
      'Failed to configure Layout: expected to have at least one breakpoint specified, but got none.',
    )

    invariant(
      this.options.breakpoints.hasOwnProperty(defaultBreakpointName),
      'Failed to configure Layout: cannot use "%s" as the default breakpoint (breakpoint not found).',
      defaultBreakpointName,
    )

    /* Mark configure method as called to prevent its multiple calls */
    this.isConfigureCalled = warnOnMultiple

    return this
  }

  /**
   * Returns the list of all breakpoint names.
   */
  public getBreakpointNames(): string[] {
    // @todo adjust to use "BreakpointNames" from generics
    return Object.keys(this.options.breakpoints)
  }

  /**
   * Returns breakpoint options by the given breakpoint name.
   */
  public getBreakpoint(breakpointName: string): Breakpoint | undefined {
    if (breakpointName) {
      return this.options.breakpoints[breakpointName]
    }

    return
  }
}

export default new Layout(defaultOptions)
