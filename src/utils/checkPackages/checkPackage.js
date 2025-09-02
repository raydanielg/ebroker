/**
 * Package Type Checks Matrix
 * ===========================
 * This table explains what checks apply to each package type.
 *
 * Package Type                    | Checks
 * ---------------------------------|------------------------
 * property_list                    | package, feature, limit
 * project_list                     | package, feature, limit
 * property_feature                 | package, feature, limit
 * project_feature                  | package, feature, limit
 * mortgage_calculator_detail       | package, feature
 * premium_properties                | package, feature
 * project_access                    | package, feature
 *
 * Explanation:
 * - package: Check if user has a valid package for this type.
 * - feature: Check if the feature is available within the package.
 * - limit: Check if there is remaining quota within the package (only for types with limit).
 */

import { checkPackageLimitApi } from "@/api/apiRoutes";
import { PackagesWithLimit } from "./packageTypes";

export const checkPackageAvailable = async (packageType) => {
  try {
    const response = await checkPackageLimitApi({ type: packageType });

    if (response.error) return false;
    const { package_available, feature_available, limit_available } =
      response.data || {};
    if (!package_available) return false;
    if (!feature_available) return false;

    if (PackagesWithLimit.includes(packageType)) {
      return !!limit_available;
    }

    return true; // If no limit check needed
  } catch (error) {
    console.error("Failed to check package:", error);
    return false;
  }
};
