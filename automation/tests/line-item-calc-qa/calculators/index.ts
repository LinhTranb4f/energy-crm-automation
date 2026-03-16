import { resolveProductType } from "../hubdb-tables";
import { calculateRadioSpots } from "./radio-spots";
import { calculateDigitalSpots } from "./digital-spots";
import { calculateAudioProduction } from "./audio-production";
import { calculateRadioSponsoring } from "./radio-sponsoring";
import type { CalculationResult, LineItemProps } from "./types";

export type { CalculationResult, LineItemProps } from "./types";

export async function calculate(
  props: LineItemProps,
): Promise<CalculationResult> {
  const productType = resolveProductType(props.name);
  if (!productType) {
    throw new Error(
      `Unrecognised line item name "${props.name}" – cannot route to a calculator`,
    );
  }

  switch (productType) {
    case "radioSpots":
      return calculateRadioSpots(props);
    case "digitalSpots":
      return calculateDigitalSpots(props);
    case "audioProduction":
      return calculateAudioProduction(props);
    case "radioSponsoring":
      return calculateRadioSponsoring(props);
  }
}
