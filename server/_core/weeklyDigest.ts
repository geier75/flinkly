// @ts-nocheck
/**
 * Weekly-Digest-Content-Aggregation
 * 
 * Sammelt Daten für den wöchentlichen Digest:
 * - Neue Gigs in favorisierten Kategorien
 * - Ungelesene Nachrichten
 * - Offene Aufträge
 */

import { getDb } from "../adapters";
import { gigs, messages, orders, users } from "../../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export interface DigestData {
  userName: string;
  newGigs: Array<{ id: number; title: string; category: string; price: number }>;
  unreadMessages: number;
  openOrders: Array<{ id: number; gigTitle: string; status: string }>;
}

/**
 * Aggregiert Digest-Content für einen User
 */
export async function aggregateDigestContent(userId: number): Promise<DigestData | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[WeeklyDigest] Database not available");
    return null;
  }

  try {
    // 1. User-Daten abrufen
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userResult.length === 0) {
      console.warn(`[WeeklyDigest] User ${userId} not found`);
      return null;
    }
    const user = userResult[0];

    // 2. Neue Gigs der letzten 7 Tage (alle Kategorien, da wir keine Favoriten-Tabelle haben)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newGigsResult = await db
      .select({
        id: gigs.id,
        title: gigs.title,
        category: gigs.category,
        price: gigs.price,
      })
      .from(gigs)
      .where(gte(gigs.createdAt, oneWeekAgo))
      .limit(5); // Max 5 Gigs im Digest

    // 3. Ungelesene Nachrichten zählen
    // Zähle Messages wo readAt null ist und senderId != userId
    const unreadMessagesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          sql`${messages.senderId} != ${userId}`,
          sql`${messages.readAt} IS NULL`
        )
      );
    const unreadMessages = Number(unreadMessagesResult[0]?.count || 0);

    // 4. Offene Aufträge (Status: pending, in_progress)
    const openOrdersResult = await db
      .select({
        id: orders.id,
        gigId: orders.gigId,
        status: orders.status,
      })
      .from(orders)
      .where(
        and(
          eq(orders.buyerId, userId),
          sql`${orders.status} IN ('pending', 'in_progress')`
        )
      )
      .limit(5); // Max 5 Orders im Digest

    // Gig-Titel für offene Orders abrufen
    const openOrders = await Promise.all(
      openOrdersResult.map(async (order) => {
        const gigResult = await db
          .select({ title: gigs.title })
          .from(gigs)
          .where(eq(gigs.id, order.gigId))
          .limit(1);
        return {
          id: order.id,
          gigTitle: gigResult[0]?.title || "Unbekannter Gig",
          status: order.status || "pending",
        };
      })
    );

    return {
      userName: user.name || "Flinkly-Nutzer",
      newGigs: newGigsResult.map((gig) => ({
        id: gig.id,
        title: gig.title,
        category: gig.category,
        price: gig.price,
      })),
      unreadMessages,
      openOrders,
    };
  } catch (error) {
    console.error("[WeeklyDigest] Error aggregating digest content:", error);
    return null;
  }
}

/**
 * Gibt alle User-IDs zurück, die einen Digest erhalten sollen
 * (alle registrierten User, außer Admin)
 */
export async function getDigestRecipients(): Promise<number[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[WeeklyDigest] Database not available");
    return [];
  }

  try {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`${users.role} != 'admin'`);
    return result.map((user) => user.id);
  } catch (error) {
    console.error("[WeeklyDigest] Error fetching digest recipients:", error);
    return [];
  }
}
