export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface FeatureInfo {
  id: string;
  sectionLabel: string;
  navItems: Array<{ path: string; label: string }>;
}

/**
 * Generate breadcrumb items from a pathname and feature definitions
 */
export function generateBreadcrumbs(pathname: string, features: FeatureInfo[]): BreadcrumbItem[] {
  // Remove trailing slash
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // Home is always the root
  if (cleanPath === '/') {
    return [{ label: 'Home', path: '/' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  // Try to find the route in features
  let foundInFeatures = false;

  for (const feature of features) {
    for (const navItem of feature.navItems) {
      if (cleanPath === navItem.path || cleanPath.startsWith(navItem.path + '/')) {
        // Found a matching nav item
        breadcrumbs.push({
          label: navItem.label,
          path: navItem.path,
        });
        foundInFeatures = true;

        // If the path is deeper than the nav item, add sub-paths
        if (cleanPath !== navItem.path) {
          const remaining = cleanPath.slice(navItem.path.length + 1);
          const segments = remaining.split('/').filter(Boolean);

          segments.forEach((segment, index) => {
            const segmentPath = navItem.path + '/' + segments.slice(0, index + 1).join('/');
            const label = formatSegment(segment);
            breadcrumbs.push({ label, path: segmentPath });
          });
        }

        break;
      }
    }

    if (foundInFeatures) break;
  }

  // If not found in features, generate from path segments
  if (!foundInFeatures) {
    const segments = cleanPath.split('/').filter(Boolean);
    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const label = formatSegment(segment);
      breadcrumbs.push({ label, path });
    });
  }

  return breadcrumbs;
}

/**
 * Format a path segment into a readable label
 */
function formatSegment(segment: string): string {
  // Convert kebab-case and snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
