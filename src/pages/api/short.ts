import type { APIRoute } from "astro";
import { JResponse } from "../../utils/response";
import type { ShortnerResponse } from "../../types/shortner";
import { saveLink } from "../../db/shortner";

export const GET: APIRoute = async ({ request }) => {
  const reqUrl = new URL(request.url);

  const toBeShortened = reqUrl.searchParams.get("link");

  if (toBeShortened) {
    if (!URL.canParse(toBeShortened)) {
      return JResponse<ShortnerResponse>(
        {
          message: "You must send a valid URL",
          link: "",
        },
        400
      );
    }

    const id = await saveLink(toBeShortened);

    if (id) {
      return JResponse<ShortnerResponse>({
        message: "Success",
        link: `${reqUrl.origin}/s/${id}`,
      });
    } else {
      return JResponse<ShortnerResponse>(
        {
          message: "Link couldn't be saved",
          link: "",
        },
        400
      );
    }
  } else {
    return JResponse<ShortnerResponse>(
      {
        message: "Link couldn't be found",
        link: "",
      },
      400
    );
  }
};
