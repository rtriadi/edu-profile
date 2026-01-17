import { Metadata } from "next";
import { getContactMessages, markMessageAsRead, deleteContactMessage } from "@/actions/contact";
import { MessagesTable } from "@/components/admin/messages/messages-table";

export const metadata: Metadata = {
  title: "Pesan Masuk",
  description: "Kelola pesan dari pengunjung website",
};

interface MessagesPageProps {
  searchParams: Promise<{
    page?: string;
    isRead?: string;
  }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const isRead = params.isRead === "true" ? true : params.isRead === "false" ? false : undefined;

  const { data: messages, pagination } = await getContactMessages({
    page,
    limit: 10,
    isRead,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pesan Masuk</h1>
        <p className="text-muted-foreground">
          Pesan yang dikirim melalui form kontak website
        </p>
      </div>

      <MessagesTable messages={messages} pagination={pagination} />
    </div>
  );
}
