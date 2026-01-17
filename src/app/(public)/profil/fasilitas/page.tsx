import { Metadata } from "next";
import Image from "next/image";
import { Building2, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedFacilities } from "@/actions/facilities";

export const metadata: Metadata = {
  title: "Fasilitas Sekolah",
  description: "Fasilitas dan sarana prasarana sekolah",
};

export default async function FasilitasPage() {
  const facilities = await getPublishedFacilities();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fasilitas Sekolah</h1>
        <p className="text-muted-foreground">
          Sarana dan prasarana yang mendukung proses pembelajaran
        </p>
      </div>

      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((facility) => {
            const images = (facility.images as string[]) || [];
            const features = (facility.features as string[]) || [];
            const firstImage = images[0];

            return (
              <Card key={facility.id} className="overflow-hidden">
                {firstImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={firstImage}
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {facility.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {facility.description && (
                    <p className="text-muted-foreground mb-4">
                      {facility.description}
                    </p>
                  )}

                  {features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Fitur:</p>
                      <ul className="space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {images.slice(1, 5).map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded overflow-hidden"
                        >
                          <Image
                            src={url}
                            alt={`${facility.name} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data fasilitas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
